// ============================================================
// Simamia Pro — Database TypeScript Types
// Matches the Supabase PostgreSQL schema exactly
// ============================================================

export type AccountTier = 'leniency' | 'premium'
export type UnitStatus = 'vacant' | 'occupied'
export type MessageType = 'reminder' | 'broadcast'

export interface Landlord {
  id: string
  name: string
  phone: string
  profile_photo_url: string | null
  account_tier: AccountTier
  sms_credits: number
  created_at: string
}

export interface Property {
  id: string
  landlord_id: string
  name: string
  property_type: string
  location: string
  created_at: string
}

export interface Unit {
  id: string
  property_id: string
  custom_name: string
  unit_type: string
  monthly_rent: number
  unit_photo_url: string | null
  status: UnitStatus
  created_at: string
  updated_at: string
}

export interface Tenant {
  id: string
  unit_id: string
  name: string
  phone: string
  move_in_date: string | null
  lease_end_date: string | null
  contract_start_date?: string | null
  past_debt_amount?: number
  created_at: string
  updated_at: string
}

export interface SmsLog {
  id: string
  landlord_id: string
  message_type: MessageType
  credits_used: number
  delivery_status: string
  recipient_phone: string | null
  message_preview: string | null
  timestamp: string
}

export interface Payment {
  id: string
  tenant_id: string
  amount: number
  payment_date: string
  payment_method: string
  reference_number: string | null
  created_at: string
}

// Joined / extended types used in UI
export interface PropertyWithUnits extends Property {
  units: Unit[]
}

export interface UnitWithTenant extends Unit {
  tenant: Tenant | null
}

export interface PropertyWithUnitsAndTenants extends Property {
  units: UnitWithTenant[]
}

export interface TenantWithUnit extends Tenant {
  unit: Unit & {
    property: Property
  }
}
