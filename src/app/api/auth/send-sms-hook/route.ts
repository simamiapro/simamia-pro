import { NextResponse } from 'next/server'
import { Webhook } from 'standardwebhooks'

const BEEM_API_URL = 'https://apisms.beem.africa/v1/send'

interface SupabaseSmsPayload {
  user: {
    id: string
    phone: string
  }
  sms: {
    otp: string
  }
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    
    // Verify Webhook Signature
    const rawSecret = process.env.SEND_SMS_HOOK_SECRET
    if (!rawSecret) {
      console.error('SEND_SMS_HOOK_SECRET is not configured')
      return NextResponse.json({ error: { http_code: 500, message: "Webhook secret not configured" } }, { status: 500 })
    }

    const secretKey = rawSecret.startsWith("v1,whsec_") 
      ? rawSecret.replace("v1,whsec_", "") 
      : rawSecret.replace("whsec_", "")

    try {
      const headers = Object.fromEntries(req.headers)
      const wh = new Webhook(secretKey)
      wh.verify(rawBody, headers)
    } catch (err) {
      console.error('Invalid webhook signature:', err)
      return NextResponse.json({ error: { http_code: 401, message: "Invalid webhook signature" } }, { status: 401 })
    }

    const payload = JSON.parse(rawBody) as SupabaseSmsPayload
    const { phone } = payload.user
    const { otp } = payload.sms
    
    // Send SMS via Beem
    const apiKey = process.env.BEEM_API_KEY
    const apiSecret = process.env.BEEM_API_SECRET
    const senderId = process.env.BEEM_SENDER_ID || 'JiGlo'

    if (!apiKey || !apiSecret) {
      console.error('Beem credentials not configured')
      return NextResponse.json({ error: { http_code: 500, message: "Beem credentials not configured" } }, { status: 500 })
    }

    const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
    
    // Format phone number to standard format Beem expects (remove '+')
    // Beem expects format like 2557XXXXXXXX or 254XXXXXXXX
    const formattedPhone = phone.replace('+', '')

    console.log(`Sending OTP to ${formattedPhone} via Beem...`)

    const beemRes = await fetch(BEEM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        source_addr: senderId,
        schedule_time: '',
        encoding: 0,
        message: `Neno siri lako la Simamia Pro ni: ${otp}`,
        recipients: [
          {
            recipient_id: 1,
            dest_addr: formattedPhone
          }
        ]
      })
    })

    const beemData = await beemRes.json()
    console.log('Beem Response:', JSON.stringify(beemData))

    // Beem returns code 100 for successful submission
    if (!beemRes.ok || beemData.code !== 100) {
      console.error('Beem API returned an error:', beemData)
      return NextResponse.json({ error: { http_code: 500, message: "Failed to send SMS via Beem" } }, { status: 500 })
    }

    return NextResponse.json({ message: "SMS sent successfully" })

  } catch (error: any) {
    console.error('SMS Hook Error:', error)
    return NextResponse.json({ error: { http_code: 500, message: error.message || "Internal server error" } }, { status: 500 })
  }
}
