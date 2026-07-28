/**
 * Beem Africa SMS API client
 * Docs: https://apisms.beem.africa
 */

const BEEM_BASE_URL = 'https://apisms.beem.africa/v1/send'
const BEEM_SENDER_ID = process.env.BEEM_SENDER_ID || 'JiGlo'

function getAuthToken(): string {
  const apiKey = process.env.BEEM_API_KEY
  const secretKey = process.env.BEEM_API_SECRET || process.env.BEEM_SECRET_KEY
  if (!apiKey || !secretKey) {
    throw new Error('Beem API credentials not configured')
  }
  return Buffer.from(`${apiKey}:${secretKey}`).toString('base64')
}

/**
 * Format a phone number to Beem international format (255XXXXXXXXX)
 * Handles: 0712345678 → 255712345678, +255712345678 → 255712345678
 */
export function formatPhoneForBeem(phone: string): string {
  const clean = phone.replace(/\s+/g, '').replace(/[+\-()]/g, '')
  if (clean.startsWith('255') && clean.length === 12) return clean
  if (clean.startsWith('0') && clean.length === 10) return `255${clean.slice(1)}`
  if (clean.length === 9) return `255${clean}`
  return clean
}

export interface BeemRecipient {
  recipient_id: number
  dest_addr: string
}

export interface BeemSendResult {
  success: boolean
  status_code?: number
  message?: string
  raw?: unknown
}

/**
 * Send an SMS via Beem Africa API
 */
export async function sendSms(
  phone: string,
  message: string,
  recipientId = 1
): Promise<BeemSendResult> {
  const dest_addr = formatPhoneForBeem(phone)

  try {
    const res = await fetch(BEEM_BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_addr: BEEM_SENDER_ID,
        encoding: 0,
        message,
        recipients: [{ recipient_id: recipientId, dest_addr }],
      }),
    })

    const data = await res.json()

    return {
      success: res.ok && data?.code === 100, // Beem code 100 is Success
      status_code: data?.code || res.status,
      message: data?.message || JSON.stringify(data),
      raw: data,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send SMS to multiple recipients
 */
export async function sendSmsBulk(
  recipients: Array<{ phone: string; message: string }>
): Promise<BeemSendResult[]> {
  const results = await Promise.allSettled(
    recipients.map((r, i) => sendSms(r.phone, r.message, i + 1))
  )
  return results.map((r) =>
    r.status === 'fulfilled' ? r.value : { success: false, message: 'Promise rejected' }
  )
}
