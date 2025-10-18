-- =====================================================================
-- Migration: 20251018T214300_initial_schema.sql
-- Purpose : Create core tables (bodies, branches), audit logging system,
--           and Row Level Security (RLS) policies for read-only frontend.
-- Author  : (your name)
-- Date    : 2025-10-18 21:43 UTC
-- =====================================================================

-- ---------------------------------------------------------------------
-- CLEANUP (safe for re-running during development)
-- ---------------------------------------------------------------------
-- The CASCADE keyword ensures dependent triggers or views are also dropped.
-- In production migrations, omit CASCADE to avoid accidental drops.
DROP TABLE IF EXISTS public.audit_log CASCADE;
DROP TABLE IF EXISTS public.bodies CASCADE;
DROP TABLE IF EXISTS public.branches CASCADE;

-- ---------------------------------------------------------------------
-- MAIN DATA TABLES
-- ---------------------------------------------------------------------

-- TABLE: bodies
-- Stores main pipe body specifications.
CREATE TABLE public.bodies (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  diameter NUMERIC(6,2) NOT NULL,
  length NUMERIC(6,2) NOT NULL,
  short_leg NUMERIC(6,2) NOT NULL,
  long_leg NUMERIC(6,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: branches
-- Stores branch pipe specifications.
CREATE TABLE public.branches (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  diameter NUMERIC(6,2) NOT NULL,
  length NUMERIC(6,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- AUDIT LOGGING SYSTEM
-- ---------------------------------------------------------------------

-- TABLE: audit_log
-- Records every data change (INSERT, UPDATE, DELETE) for traceability.
CREATE TABLE public.audit_log (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id BIGINT,
  action TEXT NOT NULL,                -- 'INSERT', 'UPDATE', 'DELETE'
  old_data JSONB,
  new_data JSONB,
  changed_by UUID,                     -- Supabase Auth user (if available)
  db_user TEXT,                        -- PostgreSQL role that performed the action
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- FUNCTION: audit_trigger_fn
-- Automatically inserts an audit log entry whenever data changes.
CREATE OR REPLACE FUNCTION public.audit_trigger_fn()
RETURNS TRIGGER AS $$
DECLARE
  uid UUID;
BEGIN
  uid := auth.uid(); -- Capture Supabase Auth user (null for service_role)
  INSERT INTO public.audit_log (
    table_name, record_id, action, old_data, new_data, changed_by, db_user, changed_at
  )
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) END,
    CASE WHEN TG_OP IN ('UPDATE','INSERT') THEN to_jsonb(NEW) END,
    uid,
    current_user,
    NOW()
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGERS: Attach audit logging to both data tables.
CREATE TRIGGER bodies_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.bodies
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn();

CREATE TRIGGER branches_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.branches
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn();

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------------
-- Enable RLS to enforce read-only behavior for public access.
ALTER TABLE public.bodies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- (A) Frontend users (publishable key: anon/authenticated)
--     Can only read data.
CREATE POLICY "public_read_bodies"
  ON public.bodies
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_branches"
  ON public.branches
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- (B) Supabase Dashboard / Admin (service_role)
--     Full access to modify data and manage schema.
CREATE POLICY "admin_full_bodies"
  ON public.bodies
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "admin_full_branches"
  ON public.branches
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- (C) Audit log visibility
--     Only admins (service_role) can view audit_log.
CREATE POLICY "service_role_read_audit"
  ON public.audit_log
  FOR SELECT
  TO service_role
  USING (true);

-- ---------------------------------------------------------------------
-- PRIVILEGES
-- ---------------------------------------------------------------------
-- Revoke write privileges from public to prevent unauthorized changes.
REVOKE INSERT, UPDATE, DELETE ON public.bodies FROM PUBLIC;
REVOKE INSERT, UPDATE, DELETE ON public.branches FROM PUBLIC;
REVOKE ALL ON public.audit_log FROM PUBLIC;

-- Grant full privileges to service_role (Supabase backend & dashboard).
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;

-- ---------------------------------------------------------------------
-- SUMMARY
-- ---------------------------------------------------------------------
-- ✔ Frontend (publishable key) → read-only access via RLS
-- ✔ Admin (service_role) → full read/write via dashboard
-- ✔ All changes → logged automatically in audit_log
-- ✔ audit_log table → private and RLS-protected
-- =====================================================================
