-- =====================================================================
-- Migration: 20251021T182000_devices_cases_and_users.up.sql
-- Purpose : Extend the EVAR database with manufacturers, devices,
--           patients, anatomical measurements, recommendations,
--           and users while preserving current structure.
-- Depends : 20251018T172700_initial_schema.up.sql
-- Author  : Sergio Dominguez Moreno
-- Date    : 2025-10-21 12:28 UTC
-- =====================================================================

-- ---------------------------------------------------------------------
-- TABLE: manufacturers
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.manufacturers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    country TEXT,
    website TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.manufacturers IS
  'Catalog of medical device manufacturers producing aortic prostheses.';

COMMENT ON COLUMN public.manufacturers.id IS
  'Unique identifier for each manufacturer.';

COMMENT ON COLUMN public.manufacturers.name IS
  'Official manufacturer name (e.g., Medtronic, Gore, Cook).';

COMMENT ON COLUMN public.manufacturers.country IS
  'Country of headquarters or principal operations.';

COMMENT ON COLUMN public.manufacturers.website IS
  'Official website for the manufacturer or brand.';

COMMENT ON COLUMN public.manufacturers.created_at IS
  'Timestamp when the manufacturer record was created.';


-- ---------------------------------------------------------------------
-- TABLE: devices
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.devices (
    id BIGSERIAL PRIMARY KEY,
    manufacturer_id BIGINT REFERENCES public.manufacturers(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    device_type TEXT CHECK (device_type IN ('body','branch','combined')),
    model_code TEXT,
    ce_mark BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.devices IS
  'Catalog of device families or models used in EVAR procedures, linked to a manufacturer.';

COMMENT ON COLUMN public.devices.id IS
  'Unique identifier for each device model or product family.';

COMMENT ON COLUMN public.devices.manufacturer_id IS
  'Reference to the manufacturer producing this device family.';

COMMENT ON COLUMN public.devices.name IS
  'Device family or model name (e.g., Endurant II, Excluder, Zenith Alpha).';

COMMENT ON COLUMN public.devices.device_type IS
  'Type of device: main body, branch, or combined configuration.';

COMMENT ON COLUMN public.devices.model_code IS
  'Internal or catalog code identifying a specific version or series.';

COMMENT ON COLUMN public.devices.ce_mark IS
  'Indicates if the device holds an active CE mark approval for use in the EU.';

COMMENT ON COLUMN public.devices.notes IS
  'Free-text field for additional metadata or remarks about the device.';

COMMENT ON COLUMN public.devices.created_at IS
  'Timestamp of device record creation.';


-- ---------------------------------------------------------------------
-- TABLE: patients
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    age INT,
    sex TEXT CHECK (sex IN ('M','F','Other')),
    height NUMERIC,
    weight NUMERIC,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.patients IS
  'Anonymized patient metadata for recording anatomical measurements and recommendations.';

COMMENT ON COLUMN public.patients.id IS
  'Unique anonymized UUID assigned to each patient record.';

COMMENT ON COLUMN public.patients.age IS
  'Patient age (years) at the time of measurement or planning.';

COMMENT ON COLUMN public.patients.sex IS
  'Recorded biological sex of the patient: M, F, or Other.';

COMMENT ON COLUMN public.patients.height IS
  'Patient height (cm). Optional for indexing against body size.';

COMMENT ON COLUMN public.patients.weight IS
  'Patient weight (kg). Optional for hemodynamic correlation.';

COMMENT ON COLUMN public.patients.notes IS
  'Free-text notes for clinical or anatomical context.';

COMMENT ON COLUMN public.patients.created_at IS
  'Timestamp when the patient record was created.';


-- ---------------------------------------------------------------------
-- TABLE: anatomical_measurements
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.anatomical_measurements (
    id BIGSERIAL PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    measurement_name TEXT NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT DEFAULT 'mm',
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.anatomical_measurements IS
  'Stores per-patient anatomical measurements such as diameters, lengths, or angles.';

COMMENT ON COLUMN public.anatomical_measurements.id IS
  'Unique identifier for each stored measurement.';

COMMENT ON COLUMN public.anatomical_measurements.patient_id IS
  'Reference to the patient record this measurement belongs to.';

COMMENT ON COLUMN public.anatomical_measurements.measurement_name IS
  'Descriptive name of the anatomical measurement (e.g., neck_diameter, iliac_length).';

COMMENT ON COLUMN public.anatomical_measurements.value IS
  'Numeric measurement value.';

COMMENT ON COLUMN public.anatomical_measurements.unit IS
  'Unit of measurement (default: millimeters).';

COMMENT ON COLUMN public.anatomical_measurements.created_at IS
  'Timestamp when the measurement was recorded.';


-- ---------------------------------------------------------------------
-- TABLE: recommendations
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recommendations (
    id BIGSERIAL PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    body_id BIGINT REFERENCES public.bodies(id) ON DELETE SET NULL,
    branch_ids BIGINT[] DEFAULT '{}',
    generated_by UUID,
    version TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.recommendations IS
  'Algorithm-generated recommendations linking a patient to selected prosthetic components.';

COMMENT ON COLUMN public.recommendations.id IS
  'Unique identifier for each recommendation record.';

COMMENT ON COLUMN public.recommendations.patient_id IS
  'Patient associated with this sizing or planning recommendation.';

COMMENT ON COLUMN public.recommendations.body_id IS
  'Reference to the selected main body prosthesis from the bodies table.';

COMMENT ON COLUMN public.recommendations.branch_ids IS
  'Array of branch prosthesis IDs used for iliac extensions.';

COMMENT ON COLUMN public.recommendations.generated_by IS
  'UUID of the user or session that generated this recommendation.';

COMMENT ON COLUMN public.recommendations.version IS
  'Version identifier of the sizing algorithm or dataset used.';

COMMENT ON COLUMN public.recommendations.notes IS
  'Free-text comments explaining rationale or caveats.';

COMMENT ON COLUMN public.recommendations.created_at IS
  'Timestamp when the recommendation was created.';


-- ---------------------------------------------------------------------
-- TABLE: users
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT UNIQUE,
    role TEXT CHECK (role IN ('admin','clinician','viewer')),
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.users IS
  'Registered application users for attribution, permissions, and audit trail context.';

COMMENT ON COLUMN public.users.id IS
  'UUID uniquely identifying each user.';

COMMENT ON COLUMN public.users.name IS
  'Full display name of the user.';

COMMENT ON COLUMN public.users.email IS
  'User email address (unique).';

COMMENT ON COLUMN public.users.role IS
  'User role controlling access level: admin, clinician, or viewer.';

COMMENT ON COLUMN public.users.created_at IS
  'Timestamp of user registration or import.';


-- ---------------------------------------------------------------------
-- ALTER EXISTING TABLES
-- ---------------------------------------------------------------------

ALTER TABLE public.bodies
  ADD COLUMN IF NOT EXISTS device_id BIGINT REFERENCES public.devices(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

COMMENT ON COLUMN public.bodies.device_id IS
  'Reference to the device family or model this body graft belongs to.';

COMMENT ON COLUMN public.bodies.updated_at IS
  'Timestamp of the last update to this record.';

ALTER TABLE public.branches
  ADD COLUMN IF NOT EXISTS device_id BIGINT REFERENCES public.devices(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

COMMENT ON COLUMN public.branches.device_id IS
  'Reference to the device family or model this branch graft belongs to.';

COMMENT ON COLUMN public.branches.updated_at IS
  'Timestamp of the last update to this record.';


-- ---------------------------------------------------------------------
-- IMPROVED AUDIT LOG
-- ---------------------------------------------------------------------
ALTER TABLE public.audit_log
  ADD COLUMN IF NOT EXISTS user_email TEXT,
  ADD COLUMN IF NOT EXISTS user_role TEXT,
  ADD COLUMN IF NOT EXISTS case_id BIGINT REFERENCES public.recommendations(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.audit_log.user_email IS
  'Email of the user who initiated the data change (if known).';

COMMENT ON COLUMN public.audit_log.user_role IS
  'Role of the user performing the change (admin, clinician, viewer).';

COMMENT ON COLUMN public.audit_log.case_id IS
  'Optional link to a recommendation or case for contextual auditing.';


-- ---------------------------------------------------------------------
-- TABLE: device_specs (optional granular parameters)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.device_specs (
    id BIGSERIAL PRIMARY KEY,
    device_id BIGINT REFERENCES public.devices(id) ON DELETE CASCADE,
    parameter_name TEXT NOT NULL,
    parameter_value TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.device_specs IS
  'Flexible list of parameter/value pairs describing specific technical specifications of each device.';

COMMENT ON COLUMN public.device_specs.id IS
  'Unique identifier for the device specification record.';

COMMENT ON COLUMN public.device_specs.device_id IS
  'Reference to the parent device this specification belongs to.';

COMMENT ON COLUMN public.device_specs.parameter_name IS
  'Name of the specification parameter (e.g., delivery system size, oversizing %).';

COMMENT ON COLUMN public.device_specs.parameter_value IS
  'Value or text representation of the specification parameter.';

COMMENT ON COLUMN public.device_specs.created_at IS
  'Timestamp when the specification record was created.';


-- ---------------------------------------------------------------------
-- SUMMARY
-- ---------------------------------------------------------------------
-- 1. Adds manufacturer/device hierarchy for modular cataloging.
-- 2. Enables patient and measurement data storage.
-- 3. Supports recommendation tracking.
-- 4. Enhances audit log traceability.
-- 5. Maintains compatibility with existing RLS and triggers.
-- =====================================================================
