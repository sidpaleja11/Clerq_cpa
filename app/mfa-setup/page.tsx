'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function MfaSetupPage() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [factorId, setFactorId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [enrolling, setEnrolling] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function enroll() {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Clerq Authenticator',
      })

      if (error || !data) {
        setError(error?.message ?? 'Failed to start MFA enrollment.')
        setEnrolling(false)
        return
      }

      setFactorId(data.id)
      setQrCode(data.totp.qr_code)
      setSecret(data.totp.secret)
      setEnrolling(false)
    }

    enroll()
  }, [])

  async function verifyAndActivate(e: React.FormEvent) {
    e.preventDefault()
    if (!factorId) return
    setLoading(true)
    setError(null)

    // Create a challenge then verify it
    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId })

    if (challengeError || !challengeData) {
      setError(challengeError?.message ?? 'Challenge failed.')
      setLoading(false)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    })

    if (verifyError) {
      setError('Invalid code. Check your authenticator app and try again.')
      setLoading(false)
      return
    }

    // MFA enrolled and verified — go to dashboard
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Set up two-factor authentication</h1>
          <p className="mt-2 text-sm text-gray-600">
            MFA is required for all Clerq accounts. Scan the QR code with your authenticator app
            (Google Authenticator, Authy, 1Password, etc.).
          </p>
        </div>

        {enrolling && (
          <div className="text-center py-8 text-gray-400 text-sm">Loading QR code…</div>
        )}

        {!enrolling && qrCode && (
          <div className="flex flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCode} alt="MFA QR code" className="w-48 h-48 border border-gray-200 rounded-lg" />
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Or enter this secret manually:</p>
              <code className="text-xs bg-gray-100 px-3 py-1 rounded font-mono break-all">
                {secret}
              </code>
            </div>
          </div>
        )}

        {!enrolling && (
          <form onSubmit={verifyAndActivate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter the 6-digit code from your app
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-center text-lg tracking-widest font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Verifying…' : 'Activate MFA & continue'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
