-- Create payments table to track cashflow
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method TEXT NOT NULL,
    reference_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow landlord to view their own tenants' payments
CREATE POLICY "Landlords can view payments for their tenants"
ON public.payments FOR SELECT
USING (
    tenant_id IN (
        SELECT t.id FROM public.tenants t
        JOIN public.units u ON t.unit_id = u.id
        JOIN public.properties p ON u.property_id = p.id
        WHERE p.landlord_id = auth.uid()
    )
);

-- Allow landlord to insert payments for their tenants
CREATE POLICY "Landlords can insert payments for their tenants"
ON public.payments FOR INSERT
WITH CHECK (
    tenant_id IN (
        SELECT t.id FROM public.tenants t
        JOIN public.units u ON t.unit_id = u.id
        JOIN public.properties p ON u.property_id = p.id
        WHERE p.landlord_id = auth.uid()
    )
);

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
