import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { landlordId } = await request.json()
    if (!landlordId) {
      return NextResponse.json({ error: 'Missing landlordId' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Deleting the user from auth.users automatically triggers ON DELETE CASCADE
    // removing their rows in public.landlords, properties, units, tenants, etc.
    const { error } = await supabase.auth.admin.deleteUser(landlordId)

    if (error) {
      console.error('Delete user error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('API /admin/delete-user Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
