-- Drop rent_due_day from tenants table as it is redundant
ALTER TABLE public.tenants
DROP COLUMN IF EXISTS rent_due_day;

-- Refresh schema cache for APIs
NOTIFY pgrst, 'reload schema';
