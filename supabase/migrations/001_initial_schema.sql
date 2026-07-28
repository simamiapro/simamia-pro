-- ============================================================
-- Simamia Pro — Initial Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ------------------------------------------------------------
-- 1. ENUM Types
-- ------------------------------------------------------------
CREATE TYPE account_tier AS ENUM ('leniency', 'premium');
CREATE TYPE unit_status  AS ENUM ('vacant', 'occupied');
CREATE TYPE message_type AS ENUM ('reminder', 'broadcast');

-- ------------------------------------------------------------
-- 2. Tables
-- ------------------------------------------------------------

-- Landlords (mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.landlords (
  id                UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name              TEXT         NOT NULL DEFAULT '',
  phone             TEXT         NOT NULL DEFAULT '',
  profile_photo_url TEXT,
  account_tier      account_tier NOT NULL DEFAULT 'leniency',
  sms_credits       INTEGER      NOT NULL DEFAULT 0 CHECK (sms_credits >= 0),
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Properties
CREATE TABLE IF NOT EXISTS public.properties (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id   UUID        NOT NULL REFERENCES public.landlords(id) ON DELETE CASCADE,
  property_type TEXT        NOT NULL DEFAULT 'apartment',
  location      TEXT        NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Units
CREATE TABLE IF NOT EXISTS public.units (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID        NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  custom_name     TEXT        NOT NULL DEFAULT '',
  monthly_rent    INTEGER     NOT NULL DEFAULT 0 CHECK (monthly_rent >= 0),
  unit_photo_url  TEXT,
  status          unit_status NOT NULL DEFAULT 'vacant',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tenants
CREATE TABLE IF NOT EXISTS public.tenants (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id        UUID        NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  name           TEXT        NOT NULL DEFAULT '',
  phone          TEXT        NOT NULL DEFAULT '',
  move_in_date   DATE,
  lease_end_date DATE,
  rent_due_day   INTEGER     NOT NULL DEFAULT 1 CHECK (rent_due_day BETWEEN 1 AND 31),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SMS Logs
CREATE TABLE IF NOT EXISTS public.sms_logs (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id     UUID         NOT NULL REFERENCES public.landlords(id) ON DELETE CASCADE,
  message_type    message_type NOT NULL DEFAULT 'broadcast',
  credits_used    INTEGER      NOT NULL DEFAULT 1,
  delivery_status TEXT         NOT NULL DEFAULT 'pending',
  recipient_phone TEXT,
  message_preview TEXT,
  timestamp       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 3. Indexes for performance
-- ------------------------------------------------------------
CREATE INDEX idx_properties_landlord_id ON public.properties(landlord_id);
CREATE INDEX idx_units_property_id      ON public.units(property_id);
CREATE INDEX idx_tenants_unit_id        ON public.tenants(unit_id);
CREATE INDEX idx_sms_logs_landlord_id   ON public.sms_logs(landlord_id);
CREATE INDEX idx_tenants_rent_due_day   ON public.tenants(rent_due_day);

-- ------------------------------------------------------------
-- 4. updated_at trigger function
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_units_updated_at
  BEFORE UPDATE ON public.units
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- 5. Auto-create landlord row on new auth user signup
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.landlords (id, name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------
-- 6. Row Level Security (RLS)
-- ------------------------------------------------------------

ALTER TABLE public.landlords  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_logs   ENABLE ROW LEVEL SECURITY;

-- Landlords: users can only access their own row
CREATE POLICY "landlords_select_own" ON public.landlords
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "landlords_update_own" ON public.landlords
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Properties: landlord owns their properties
CREATE POLICY "properties_select_own" ON public.properties
  FOR SELECT USING (landlord_id = auth.uid());
CREATE POLICY "properties_insert_own" ON public.properties
  FOR INSERT WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "properties_update_own" ON public.properties
  FOR UPDATE USING (landlord_id = auth.uid()) WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "properties_delete_own" ON public.properties
  FOR DELETE USING (landlord_id = auth.uid());

-- Units: landlord accesses units via property ownership
CREATE POLICY "units_select_own" ON public.units
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = units.property_id AND p.landlord_id = auth.uid()
    )
  );
CREATE POLICY "units_insert_own" ON public.units
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = units.property_id AND p.landlord_id = auth.uid()
    )
  );
CREATE POLICY "units_update_own" ON public.units
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = units.property_id AND p.landlord_id = auth.uid()
    )
  );
CREATE POLICY "units_delete_own" ON public.units
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = units.property_id AND p.landlord_id = auth.uid()
    )
  );

-- Tenants: landlord accesses tenants via unit → property ownership chain
CREATE POLICY "tenants_select_own" ON public.tenants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.units u
      JOIN public.properties p ON p.id = u.property_id
      WHERE u.id = tenants.unit_id AND p.landlord_id = auth.uid()
    )
  );
CREATE POLICY "tenants_insert_own" ON public.tenants
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.units u
      JOIN public.properties p ON p.id = u.property_id
      WHERE u.id = tenants.unit_id AND p.landlord_id = auth.uid()
    )
  );
CREATE POLICY "tenants_update_own" ON public.tenants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.units u
      JOIN public.properties p ON p.id = u.property_id
      WHERE u.id = tenants.unit_id AND p.landlord_id = auth.uid()
    )
  );
CREATE POLICY "tenants_delete_own" ON public.tenants
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.units u
      JOIN public.properties p ON p.id = u.property_id
      WHERE u.id = tenants.unit_id AND p.landlord_id = auth.uid()
    )
  );

-- SMS Logs: landlords can only read their own logs
CREATE POLICY "sms_logs_select_own" ON public.sms_logs
  FOR SELECT USING (landlord_id = auth.uid());

-- ------------------------------------------------------------
-- 7. Storage bucket for unit photos
-- Run these manually in the Supabase dashboard or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('unit-photos', 'unit-photos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);
-- ------------------------------------------------------------
