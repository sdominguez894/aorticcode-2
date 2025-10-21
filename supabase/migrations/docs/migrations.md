# Supabase Migrations — Aorticcode

This folder contains all database schema migrations for the **Aorticcode** project.  
Migrations define, version, and evolve the database structure over time in a reproducible and auditable way.

---

## Folder Structure

```
/supabase
  /migrations
    20251018T172700_initial_schema.up.sql
    20251018T172700_initial_schema.down.sql
    20251021T182000_extend_schema_for_devices_cases_and_users.up.sql
    20251021T182000_extend_schema_for_devices_cases_and_users.down.sql
  /docs
    migration_changelog.md
```

### Why a *flat* folder structure?

Supabase CLI expects **all migration files** (`.up.sql` and `.down.sql`) to be placed **directly under `/supabase/migrations`**.  
It does **not scan subfolders recursively**.

That means:
- Each file is applied or rolled back in **lexicographical (timestamp) order**.
- Putting migrations in subfolders (like `/migrations/20251021_extend_schema/`) would make them **invisible** to `supabase db push`.

#### Recommended structure
Keep migrations **flat**, with one folder per environment (default is `/supabase/migrations`), and use:
```
YYYYMMDDTHHMMSS_<description>.up.sql
YYYYMMDDTHHMMSS_<description>.down.sql
```

Example:
```
20251021T182000_extend_schema_for_devices_cases_and_users.up.sql
20251021T182000_extend_schema_for_devices_cases_and_users.down.sql
```

If you need to store **supporting materials** (e.g. diagrams, data seeds, or notes), place them in `/supabase/docs/` or `/supabase/assets/` instead of inside `/migrations`.

---

## Supabase CLI Migration Workflow

| Command | Description |
|----------|-------------|
| `supabase db push` | Applies all pending `.up.sql` migrations in chronological order |
| `supabase db reset` | Drops and recreates the database, reapplying all `.up.sql` migrations |
| `supabase migration list` | Lists applied migrations in order |
| `supabase migration new <name>` | Generates a new empty migration pair for manual editing |

### Manual execution (advanced)
You can manually apply or revert a migration using `psql`:
```bash
# Apply
psql "$SUPABASE_DB_URL" -f ./supabase/migrations/20251021T182000_extend_schema_for_devices_cases_and_users.up.sql

# Rollback
psql "$SUPABASE_DB_URL" -f ./supabase/migrations/20251021T182000_extend_schema_for_devices_cases_and_users.down.sql
```

---

## Migration Naming Convention

```
YYYYMMDDTHHMMSS_<description>.up.sql
YYYYMMDDTHHMMSS_<description>.down.sql
```

| Segment | Meaning |
|----------|----------|
| `YYYYMMDDTHHMMSS` | UTC timestamp for ordering and version tracking |
| `<description>` | Short, descriptive migration summary (use lowercase and underscores) |
| `.up.sql` | Script to **apply** changes |
| `.down.sql` | Script to **revert** those changes |

Example:
```
20251018T172700_initial_schema.up.sql
20251018T172700_initial_schema.down.sql
```

---

## The `migration_changelog.md` File

Keep a separate file `/supabase/docs/migration_changelog.md` as a **living history** of your schema evolution.

### Example structure:
```markdown
# Migration Changelog — Aorticcode

| Date | Migration | Description | Author |
|------|------------|--------------|---------|
| 2025-10-18 | `initial_schema` | Created core tables: `bodies`, `branches`, and `audit_log` with RLS policies. | Sergio Dominguez Moreno |
| 2025-10-21 | `extend_schema_for_devices_cases_and_users` | Added `manufacturers`, `devices`, `patients`, `measurements`, `recommendations`, and `users` tables. | Sergio Dominguez Moreno |
```

### Why keep it
- Acts as **human-readable documentation** for the database evolution.  
- Useful for onboarding new developers or clinicians.  
- Helps correlate schema versions with app versions or deployment dates.  
- Easier to audit changes over time than reading raw SQL.

---

## Documentation Best Practices

Each migration should be **self-documenting** and easy to understand **without opening other files**.

### 1. Use consistent header blocks
At the top of each migration file:
```sql
-- =====================================================================
-- Migration: 20251021T182000_extend_schema_for_devices_cases_and_users.up.sql
-- Purpose  : Add device, manufacturer, patient, and recommendation tables.
-- Author   : Sergio Dominguez Moreno
-- Date     : 2025-10-21
-- =====================================================================
```

### 2. Comment every table and column
Use `COMMENT ON TABLE` and `COMMENT ON COLUMN` consistently:
```sql
COMMENT ON TABLE public.devices IS
  'Catalog of device families or models used in EVAR procedures.';

COMMENT ON COLUMN public.devices.ce_mark IS
  'Indicates if the device holds an active CE mark for EU use.';
```

This ensures your schema is **self-documenting inside Supabase Studio** and readable in `psql` via `\d+`.

### 3. Use section headers
Group logical areas for clarity:
```sql
-- ---------------------------------------------------------------------
-- TABLE: recommendations
-- ---------------------------------------------------------------------
```

### 4. Use safe, idempotent statements
Always include `IF EXISTS` / `IF NOT EXISTS` on `CREATE` and `DROP` statements, so migrations can be re-run in development safely.

### 5. Always include a matching `.down.sql`
Every `CREATE` in `.up.sql` should have a corresponding `DROP` in `.down.sql`, in **reverse order of dependencies**.

### 6. Maintain Row-Level Security (RLS)
After adding new tables, remember to:
```sql
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_devices"
  ON public.devices
  FOR SELECT
  TO anon, authenticated
  USING (true);
```

This keeps your frontend users read-only while allowing `service_role` full write access.

---

## Testing Migrations Locally

Before pushing to production:
```bash
supabase db reset
supabase db push
supabase migration list
```

Checklist:
- All tables and constraints created correctly  
- RLS policies still enforced  
- `.down.sql` correctly removes new schema components  
- Comments visible in Supabase Studio  

---

## Recommended Workflow

1. **Create a new migration**
   ```bash
   supabase migration new add_recommendation_summary_table
   ```

2. **Edit the generated `.up.sql` and `.down.sql`**

3. **Test locally**
   ```bash
   supabase db reset
   supabase db push
   ```

4. **Document it**
   - Add an entry to `/supabase/docs/migration_changelog.md`
   - Include a short summary in your commit message

5. **Commit and push**
   ```bash
   git add supabase/migrations supabase/docs/migration_changelog.md
   git commit -m "Add recommendation summary migration (with comments)"
   git push
   ```

---

## Quick Reference

| Action | Command |
|--------|----------|
| Apply all migrations | `supabase db push` |
| Reset & reapply all | `supabase db reset` |
| List applied migrations | `supabase migration list` |
| Create new migration | `supabase migration new <name>` |
| Rollback manually | Run the matching `.down.sql` via `psql` |

---

## Summary

- Keep migrations **flat** in `/supabase/migrations` — Supabase does not scan subfolders.  
- Follow the `YYYYMMDDTHHMMSS_<description>.up.sql` / `.down.sql` pattern.  
- Document every change in `/supabase/docs/migration_changelog.md`.  
- Comment every table and column for clarity.  
- Test locally with `supabase db reset` before pushing.  
- Never edit applied migrations — always create new ones.

With these conventions, your Supabase migrations will remain **consistent, transparent, and production-safe** for years to come 🚀

---
