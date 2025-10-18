-- =====================================================================
-- Purpose : Manage audit log growth and control audit triggers.
-- Author  : Sergio Dominguez Moreno
-- Date    : 2025-10-18 17:24 UTC
-- =====================================================================

-- ---------------------------------------------------------------------
-- OVERVIEW
-- ---------------------------------------------------------------------
-- This maintenance script provides two utilities:
--
-- (B) Archiving and cleaning old audit log entries.
-- (C) Temporarily disabling and re-enabling audit triggers.
--
-- Use this manually or via a Supabase Function to keep the audit_log
-- table small and performance high.
--
-- =====================================================================


-- ============================================================
-- SECTION B — ARCHIVE AND CLEAN OLD AUDIT LOG ENTRIES
-- ============================================================
-- Description:
--   - Exports all audit_log entries older than a retention window.
--   - Saves them into a local CSV or an archive table.
--   - Deletes old entries from the main audit_log afterward.
--
-- Usage:
--   1. Adjust the retention period below (default: 1 year).
--   2. Run this script manually from Supabase SQL Editor or psql.
-- ============================================================

DO $$
DECLARE
  retention_interval INTERVAL := INTERVAL '1 year';
  archive_table_name TEXT := 'audit_log_archive';
BEGIN
  RAISE NOTICE '--- Starting audit log archiving ---';
  RAISE NOTICE 'Archiving entries older than %', retention_interval;

  -- Create archive table if it doesn’t exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = archive_table_name
  ) THEN
    EXECUTE format('
      CREATE TABLE IF NOT EXISTS public.%I AS
      TABLE public.audit_log WITH NO DATA;
    ', archive_table_name);
    RAISE NOTICE 'Created archive table: %', archive_table_name;
  END IF;

  -- Copy old entries into the archive table
  EXECUTE format('
    INSERT INTO public.%I
    SELECT * FROM public.audit_log
    WHERE changed_at < NOW() - INTERVAL ''1 year'';
  ', archive_table_name);
  RAISE NOTICE 'Archived old entries successfully.';

  -- Delete old entries from the live audit_log
  DELETE FROM public.audit_log
  WHERE changed_at < NOW() - retention_interval;
  RAISE NOTICE 'Deleted old entries from audit_log.';

  RAISE NOTICE '--- Audit log archiving completed ---';
END $$;

COMMENT ON TABLE public.audit_log_archive IS
  'Archive table containing historical audit_log entries older than the retention window. Created automatically by maintenance script.';


-- ============================================================
-- SECTION C — DISABLE AND RE-ENABLE AUDIT TRIGGERS
-- ============================================================
-- Description:
--   - Temporarily disable audit triggers for bulk inserts/updates.
--   - Run your data import.
--   - Re-enable triggers afterward.
--
-- Example usage:
--   -- Disable before running bulk update
--   ALTER TABLE public.bodies DISABLE TRIGGER bodies_audit_trigger;
--   ALTER TABLE public.branches DISABLE TRIGGER branches_audit_trigger;
--
--   -- Perform bulk import/update
--   INSERT INTO public.bodies (...)
--   SELECT ... FROM staging_table;
--
--   -- Re-enable triggers after import
--   ALTER TABLE public.bodies ENABLE TRIGGER bodies_audit_trigger;
--   ALTER TABLE public.branches ENABLE TRIGGER branches_audit_trigger;
-- ============================================================

-- Pre-written utility commands (uncomment as needed):

-- Disable audit triggers (to pause logging)
-- ALTER TABLE public.bodies DISABLE TRIGGER bodies_audit_trigger;
-- ALTER TABLE public.branches DISABLE TRIGGER branches_audit_trigger;

-- Enable audit triggers (to resume logging)
-- ALTER TABLE public.bodies ENABLE TRIGGER bodies_audit_trigger;
-- ALTER TABLE public.branches ENABLE TRIGGER branches_audit_trigger;


-- ---------------------------------------------------------------------
-- SUMMARY
-- ---------------------------------------------------------------------
-- Safely archives audit_log data older than 1 year into audit_log_archive
-- Prevents audit table bloat over time
-- Provides trigger controls for temporary audit suspension
-- =====================================================================
