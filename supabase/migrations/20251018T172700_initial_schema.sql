-- =====================================================================
-- Migration: 20251018T163500_initial_schema.sql
-- Purpose : Create core tables (bodies, branches), audit logging system,
--           and Row Level Security (RLS) policies for read-only frontend.
-- Author  : Sergio Dominguez Moreno
-- Date    : 2025-10-18 17:27 UTC
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

-- =================================================================
-- TABLE: bodies
-- Stores main body specifications for EVAR systems.
-- Represents the main bifurcated stent graft anchored in the aorta.
-- =================================================================
CREATE TABLE public.bodies (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  diameter NUMERIC(6,2) NOT NULL,
  length NUMERIC(6,2) NOT NULL,
  short_leg NUMERIC(6,2) NOT NULL,
  long_leg NUMERIC(6,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Column descriptions
COMMENT ON TABLE public.bodies IS
  'Catalog of EVAR main body grafts (bifurcated aortic components). Each record represents a specific size/configuration.';

COMMENT ON COLUMN public.bodies.id IS
  'Unique internal identifier for the main body device configuration.';

COMMENT ON COLUMN public.bodies.code IS
  'Manufacturer product code (e.g., CXT201412E) encoding the graft model and size.';

COMMENT ON COLUMN public.bodies.diameter IS
  'Proximal aortic diameter (mm) defining the main body’s sealing zone.';

COMMENT ON COLUMN public.bodies.length IS
  'Total graft length (mm) from proximal seal to distal bifurcation.';

COMMENT ON COLUMN public.bodies.short_leg IS
  'Length (mm) of the ipsilateral (delivery side) iliac limb of the main body.';

COMMENT ON COLUMN public.bodies.long_leg IS
  'Length (mm) of the contralateral limb — connects to an iliac branch extension.';

COMMENT ON COLUMN public.bodies.created_at IS
  'Timestamp of record creation (automatically set).';


-- ===========================================================================
-- TABLE: branches
-- Stores iliac extension grafts (“branches”) used with main body components.
-- ===========================================================================
CREATE TABLE public.branches (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  diameter NUMERIC(6,2) NOT NULL,
  length NUMERIC(6,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Column descriptions
COMMENT ON TABLE public.branches IS
  'Catalog of EVAR branch limbs (iliac extensions). Each record defines one modular graft used to extend the main body into the iliac arteries.';

COMMENT ON COLUMN public.branches.id IS
  'Unique internal identifier for the branch device configuration.';

COMMENT ON COLUMN public.branches.code IS
  'Manufacturer product code (e.g., PLC141200) encoding branch diameter and length.';

COMMENT ON COLUMN public.branches.diameter IS
  'Nominal diameter (mm) of the branch limb, matching iliac artery size.';

COMMENT ON COLUMN public.branches.length IS
  'Total graft length (mm) from the bifurcation to the distal seal zone.';

COMMENT ON COLUMN public.branches.created_at IS
  'Timestamp of record creation (automatically set).';


-- ---------------------------------------------------------------------
-- AUDIT LOGGING SYSTEM
-- ---------------------------------------------------------------------

-- ============================================================
-- TABLE: audit_log
-- Records every INSERT, UPDATE, and DELETE action for traceability.
-- ============================================================
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

-- Column descriptions
COMMENT ON TABLE public.audit_log IS
  'Audit trail of all modifications made to data tables. Each entry stores before/after data and user metadata.';

COMMENT ON COLUMN public.audit_log.id IS
  'Unique audit record identifier.';

COMMENT ON COLUMN public.audit_log.table_name IS
  'Name of the table where the change occurred.';

COMMENT ON COLUMN public.audit_log.record_id IS
  'Primary key (ID) of the record affected by the change.';

COMMENT ON COLUMN public.audit_log.action IS
  'Type of database action recorded: INSERT, UPDATE, or DELETE.';

COMMENT ON COLUMN public.audit_log.old_data IS
  'JSON snapshot of the record before the change (for UPDATE/DELETE actions).';

COMMENT ON COLUMN public.audit_log.new_data IS
  'JSON snapshot of the record after the change (for INSERT/UPDATE actions).';

COMMENT ON COLUMN public.audit_log.changed_by IS
  'UUID of the Supabase Auth user performing the change, if available.';

COMMENT ON COLUMN public.audit_log.db_user IS
  'Database role (e.g., service_role, editor) responsible for executing the query.';

COMMENT ON COLUMN public.audit_log.changed_at IS
  'Timestamp of when the change was logged.';


-- FUNCTION: audit_trigger_fn
-- Automatically inserts an audit_log record whenever a table is modified.
CREATE OR REPLACE FUNCTION public.audit_trigger_fn()
RETURNS TRIGGER AS $$
DECLARE
  uid UUID;
BEGIN
  uid := auth.uid(); -- Capture Supabase Auth user (NULL for service_role)

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

COMMENT ON FUNCTION public.audit_trigger_fn() IS
  'Trigger function that logs every insert, update, or delete operation into audit_log, including user and role metadata.';

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
-- Frontend (publishable key) → read-only access via RLS
-- Admin (service_role) → full read/write access via dashboard
-- All changes automatically logged in audit_log
-- audit_log table hidden from public access
-- =====================================================================
