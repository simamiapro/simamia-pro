-- Add contract start date and past debt amount to tenants table
ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS contract_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS past_debt_amount NUMERIC NOT NULL DEFAULT 0;

-- Refresh schema cache for APIs
NOTIFY pgrst, 'reload schema';
