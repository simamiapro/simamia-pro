'use client'

import { useState } from 'react'
import { CreditCard, Phone, MessageSquare, Copy, CheckCheck, ArrowRight, Crown, Zap } from 'lucide-react'
import { formatTZS } from '@/lib/utils'
import type { Landlord } from '@/types/database'

const CREDIT_PRICE = 60 // TZS per credit
const MIN_CREDITS = 10
const MAX_CREDITS = 500

interface TopUpClientProps {
  landlord: Landlord
}

export function TopUpClient({ landlord }: TopUpClientProps) {
  const [credits, setCredits] = useState(50)
  const [copied, setCopied] = useState(false)

  const totalCost = credits * CREDIT_PRICE
  const lipaNumber = process.env.NEXT_PUBLIC_MPESA_LIPA_NAMBA ?? '5319646'
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '255789051962'
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Habari, nimetuma TZS ${totalCost.toLocaleString()} kwa Lipa Namba ${lipaNumber} kuomba credits ${credits} za SMS kwa Simamia Pro. Email yangu: [WEKA EMAIL YAKO]`
  )}`

  function handleCopy() {
    navigator.clipboard.writeText(lipaNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const presets = [25, 50, 100, 200, 500]

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Ongeza Salio / Panda Premium</h1>
        <p className="text-slate-400 text-sm mt-1">Nunua SMS credits kupitia M-Pesa</p>
      </div>

      {/* Current status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <p className="text-slate-400 text-sm mb-1">Daraja la Sasa</p>
          <div className="flex items-center gap-2">
            {landlord.account_tier === 'premium' ? (
              <><Crown size={18} className="text-amber-400" /><span className="text-amber-400 font-bold text-lg">Premium</span></>
            ) : (
              <span className="text-slate-300 font-bold text-lg">Free Version</span>
            )}
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <p className="text-slate-400 text-sm mb-1">SMS Credits Zilizobaki</p>
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-emerald-400" />
            <span className="text-white font-bold text-lg">{landlord.sms_credits}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calculator */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <MessageSquare size={16} className="text-emerald-400" />
            Hesabu Gharama
          </h2>

          {/* Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">SMS Credits</span>
              <span className="text-white font-bold text-lg">{credits}</span>
            </div>
            <input
              id="credits-slider"
              type="range"
              min={MIN_CREDITS}
              max={MAX_CREDITS}
              step={5}
              value={credits}
              onChange={(e) => setCredits(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>{MIN_CREDITS}</span>
              <span>{MAX_CREDITS}</span>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <p className="text-slate-400 text-xs mb-2">Chaguo la Haraka</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setCredits(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                    credits === p
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Cost display */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-500/20 rounded-xl p-4">
            <p className="text-emerald-300/70 text-sm mb-1">Jumla ya Kulipa</p>
            <p className="text-3xl font-bold text-white">{formatTZS(totalCost)}</p>
            <p className="text-emerald-400/60 text-xs mt-2">{credits} credits × TZS {CREDIT_PRICE.toLocaleString()} = {formatTZS(totalCost)}</p>
          </div>

          {/* What you get */}
          <div className="bg-slate-800/40 rounded-xl p-4 text-sm text-slate-300 space-y-1.5">
            <p className="font-medium text-white mb-2">Utapata:</p>
            <p>✓ SMS za maneno 1–160 = <strong>credit 1 kila moja</strong></p>
            <p>✓ SMS za maneno 161–300 = <strong>credits 2 kila moja</strong></p>
            <p>✓ Ukumbusho wa kiotomatiki ukiwa Premium</p>
          </div>
        </div>

        {/* Payment instructions */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Phone size={16} className="text-emerald-400" />
            Hatua za Kulipa
          </h2>

          {/* Steps */}
          <ol className="space-y-4">
            {[
              {
                step: '1',
                title: 'Tuma Pesa kwa M-Pesa Lipa Namba',
                content: (
                  <div className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-2.5 mt-2">
                    <div>
                      <p className="text-xs text-slate-400">Lipa Namba (RoPhi Studio)</p>
                      <p className="text-white font-bold text-lg tracking-widest">{lipaNumber}</p>
                    </div>
                    <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-white transition">
                      {copied ? <CheckCheck size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                  </div>
                ),
              },
              {
                step: '2',
                title: 'Kiasi cha kutuma',
                content: (
                  <p className="mt-1 text-emerald-400 font-bold text-xl">{formatTZS(totalCost)}</p>
                ),
              },
              {
                step: '3',
                title: 'Piga kiungo WhatsApp na utume risiti',
                content: (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-2 w-full bg-[#25d366]/10 hover:bg-[#25d366]/20 border border-[#25d366]/30 text-[#25d366] font-semibold py-2.5 rounded-xl text-sm transition"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.117.554 4.102 1.524 5.822L.054 24l6.326-1.654A11.954 11.954 0 0012 23.999c6.627 0 12-5.373 12-12S18.626 0 11.999 0zm.001 21.818a9.818 9.818 0 01-5.016-1.38l-.36-.213-3.754.982.999-3.657-.234-.375A9.821 9.821 0 012.182 12c0-5.413 4.405-9.818 9.818-9.818 5.412 0 9.818 4.405 9.818 9.818 0 5.413-4.406 9.818-9.818 9.818z"/></svg>
                    Tuma Risiti WhatsApp
                  </a>
                ),
              },
              {
                step: '4',
                title: 'Subiri uthibitisho',
                content: (
                  <p className="mt-1 text-slate-400 text-xs">Akaunti yako itasasishwa ndani ya saa limoja baada ya kuthibitishwa.</p>
                ),
              },
            ].map(({ step, title, content }) => (
              <li key={step} className="flex gap-3">
                <div className="w-6 h-6 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-xs font-bold">{step}</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-300 text-sm font-medium">{title}</p>
                  {content}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Premium upgrade notice */}
      {landlord.account_tier === 'leniency' && (
        <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-500/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Crown size={24} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-1">Taka Kuwa Premium?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Nunua credits 50 au zaidi na utume risiti ukiandika &quot;PREMIUM&quot; — akaunti yako itapandishwa kiotomatiki na admin baada ya kuthibitishwa. Premium inakuruhusu kuunda vyumba bila kikomo na kutumia SMS za otomatiki.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
