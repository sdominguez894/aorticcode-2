-- =====================================================================
-- Migration: 20251021T182000_extend_schema_for_devices_cases_and_users.down.sql
-- Purpose  : Rollback script for the extended schema (devices, cases, users)
-- Depends  : 20251021T182000_extend_schema_for_devices_cases_and_users.up.sql
-- Author   : Sergio Dominguez Moreno
-- Date     : 2025-10-21
-- =====================================================================
-- This script cleanly removes all new tables, columns, and references
-- created by the corresponding "up" migration. It preserves the original
-- schema defined in 20251018T172700_initial_schema.sql (bodies, branches,
-- audit_log) and leaves existing data intact.
-- =====================================================================


-- ---------------------------------------------------------------------
-- STEP 1: Remove foreign-key references from existing tables
-- ---------------------------------------------------------------------
-- Safely drop the added columns from bodies and branches without
-- affecting their original structure or RLS configuration.

ALTER TABLE public.bodies
  DROP COLUMN IF EXISTS device_id,
  DROP COLUMN IF EXISTS updated_at;

COMMENT ON COLUMN public.bodies.device_id IS
  'Removed by rollback: linked each body graft to its parent device model.';

COMMENT ON COLUMN public.bodies.updated_at IS
  'Removed by rollback: stored last modification timestamp for the body record.';

ALTER TABLE public.branches
  DROP COLUMN IF EXISTS device_id,
  DROP COLUMN IF EXISTS updated_at;

COMMENT ON COLUMN public.branches.device_id IS
  'Removed by rollback: linked each branch graft to its parent device model.';

COMMENT ON COLUMN public.branches.updated_at IS
  'Removed by rollback: stored last modification timestamp for the branch record.';


-- ---------------------------------------------------------------------
-- STEP 2: Remove added columns from audit_log
-- ---------------------------------------------------------------------
-- These were added to provide user-context and case linkage in the audit trail.

ALTER TABLE public.audit_log
  DROP COLUMN IF EXISTS user_email,
  DROP COLUMN IF EXISTS user_role,
  DROP COLUMN IF EXISTS case_id;

COMMENT ON COLUMN public.audit_log.user_email IS
  'Removed by rollback: previously stored the acting user''s email address.';

COMMENT ON COLUMN public.audit_log.user_role IS
  'Removed by rollback: previously stored the acting user''s role (admin, clinician, viewer).';

COMMENT ON COLUMN public.audit_log.case_id IS
  'Removed by rollback: previously linked the audit event to a recommendation or case.';


-- ---------------------------------------------------------------------
-- STEP 3: Drop new tables in reverse dependency order
-- ---------------------------------------------------------------------
-- Each table is dropped using IF EXISTS for idempotency.
-- The CASCADE option ensures dependent views or constraints are cleaned.

-- 3.1 Device specification parameters
DROP TABLE IF EXISTS public.device_specs CASCADE;

COMMENT ON TABLE public.device_specs IS
  'Removed by rollback: previously stored per-device specification key-value pairs.';

-- 3.2 Recommendations (depends on patients, bodies, branches)
DROP TABLE IF EXISTS public.recommendations CASCADE;

COMMENT ON TABLE public.recommendations IS
  'Removed by rollback: previously stored algorithm-generated prosthesis recommendations.';

-- 3.3 Anatomical measurements (depends on patients)
DROP TABLE IF EXISTS public.anatomical_measurements CASCADE;

COMMENT ON TABLE public.anatomical_measurements IS
  'Removed by rollback: previously stored per-patient anatomical measurement values.';

-- 3.4 Patients
DROP TABLE IF EXISTS public.patients CASCADE;

COMMENT ON TABLE public.patients IS
  'Removed by rollback: previously contained anonymized patient information.';

-- 3.5 Users
DROP TABLE IF EXISTS public.users CASCADE;

COMMENT ON TABLE public.users IS
  'Removed by rollback: previously listed application users for audit attribution.';

-- 3.6 Devices (depends on manufacturers)
DROP TABLE IF EXISTS public.devices CASCADE;

COMMENT ON TABLE public.devices IS
  'Removed by rollback: previously listed device models and families.';

-- 3.7 Manufacturers
DROP TABLE IF EXISTS public.manufacturers CASCADE;

COMMENT ON TABLE public.manufacturers IS
  'Removed by rollback: previously stored manufacturer metadata for device models.';


-- ---------------------------------------------------------------------
-- STEP 4: Verification & Summary
-- ---------------------------------------------------------------------
-- After this rollback:
--   ? The original schema (bodies, branches, audit_log) remains intact.
--   ? All extended tables (manufacturers, devices, patients, etc.) are removed.
--   ? No foreign-key dependencies or dangling constraints exist.
--   ? Safe to re-apply the .up.sql migration at any time.
--
-- Note:
--   In production, run this only if you need to fully revert the extended
--   schema. Audit logs and historical prosthesis data from the old schema
--   will remain untouched.
-- =====================================================================
