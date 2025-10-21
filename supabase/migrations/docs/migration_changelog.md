# 🧾 Migration Changelog — Aortic Vision Revive

This document records the chronological evolution of the **Supabase database schema** for the Aortic Vision Revive project.  
Each entry corresponds to a timestamped migration file in `/supabase/migrations`.

---

## Migration History

| Date (UTC) | Migration ID | Description | Type | Author | Notes |
|-------------|---------------|-------------|-------|---------|--------|
| **2025-10-18** | `20251018T172700_initial_schema` | Created core tables: `bodies`, `branches`, and `audit_log`. Added audit triggers and RLS policies for secure read-only access. | `up/down` pair | Sergio Dominguez Moreno | First production schema version. |
| **2025-10-21** | `20251021T182000_extend_schema_for_devices_cases_and_users` | Added `manufacturers`, `devices`, `patients`, `anatomical_measurements`, `recommendations`, and `users` tables. Linked `bodies` and `branches` to `devices`. Improved `audit_log` with user and case context. | `up/down` pair | Sergio Dominguez Moreno | Extended schema to support device catalogs, patient data, and sizing recommendations. |

---

## How to Update This File

Whenever you add a new migration:

1. Add a new row at the **top** of the table (most recent first).
2. Use the timestamp prefix from the migration filename as the **Migration ID**.
3. Provide a concise description (1-2 sentences max).
4. Mark whether it’s an `up/down` pair or one-directional (`up` only).
5. Add your name under **Author** and optional implementation notes.

---

## Example Entry Template

| Date (UTC) | Migration ID | Description | Type | Author | Notes |
|-------------|---------------|-------------|-------|---------|--------|
| YYYY-MM-DD | `YYYYMMDDTHHMMSS_<name>` | <short summary of what changed> | `up/down` pair | <your name> | <optional notes> |

---

## Tips for Maintaining the Changelog

- Keep entries **brief but meaningful** — focus on *what changed* and *why*.  
- Always update the changelog **in the same commit** as the new migration files.  
- Use UTC timestamps to stay consistent across collaborators.  
- Optionally, link to internal docs or diagrams for major migrations.

Example:
> See `/supabase/docs/diagrams/recommendations_schema_v2.png` for visual layout.

---

## Summary

This changelog serves as a human-readable **audit trail** for the schema, complementing Supabase’s internal migration history.  
It helps developers, clinicians, and reviewers quickly understand:
- When a schema change occurred  
- Who made it  
- What functionality it introduced  

Keeping this file updated ensures your database evolution remains **transparent, traceable, and reviewable**. 

---
