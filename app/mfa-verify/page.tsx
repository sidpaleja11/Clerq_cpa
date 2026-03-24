'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function MfaVerifyForm() {
  const [code, setCode] = useState('')
  const [factorId, setFactorId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'
  const supabase = createClient()

  useEffect(() => {
    async function loadFactor() {
      const { data } = await supabase.auth.mfa.listFactors()
      const totp = data?.totp?.[0]
      if (totp) setFactorId(totp.id)
    }
    loadFactor()
  }, [])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!factorId) {
      setError('No MFA factor found. Please set up MFA first.')
      return
    }
    setLoading(true)
    setError(null)

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
      setError('Invalid code. Try again.')
      setLoading(false)
      return
    }

    router.push(redirect)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-sm w-full p-8 bg-white rounded-lg shadow space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Two-factor verification</h1>
          <p className="mt-1 text-sm text-gray-600">
            Enter the code from your authenticator app.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="123456"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-center text-2xl tracking-widest font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Verifying…' : 'Verify'}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400">
          Lost access to your authenticator?{' '}
          <a href="mailto:support@clerq.app" className="text-blue-500 hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}

export default function MfaVerifyPage() {
  return (
    <Suspense>
      <MfaVerifyForm />
    </Suspense>
  )
}
