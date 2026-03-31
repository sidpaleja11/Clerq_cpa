'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { SmokeyBackground } from '@/components/ui/login-form'
import { Lock, User, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const { data: aalData } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

    if (aalData?.currentLevel !== 'aal2') {
      router.push('/mfa-verify')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className="relative w-screen h-screen bg-[#050810]">
      <SmokeyBackground color="#2a2800" className="absolute inset-0" />
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        <div className="w-full max-w-sm p-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center">
            <div className="text-[22px] font-semibold tracking-tight text-white mb-1">
              cler<span className="text-[#FEED55]">q</span>
            </div>
            <p className="text-sm text-gray-300">Sign in to your CPA workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {/* Email */}
            <div className="relative z-0">
              <input
                type="email"
                id="floating_email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-400/50 appearance-none focus:outline-none focus:ring-0 focus:border-[#FEED55] peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="floating_email"
                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FEED55] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                <User className="inline-block mr-2 -mt-1" size={14} />
                Email address
              </label>
            </div>

            {/* Password */}
            <div className="relative z-0">
              <input
                type="password"
                id="floating_password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-400/50 appearance-none focus:outline-none focus:ring-0 focus:border-[#FEED55] peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="floating_password"
                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FEED55] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                <Lock className="inline-block mr-2 -mt-1" size={14} />
                Password
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-900/40 border border-red-500/30 rounded-lg text-[12px] text-red-300">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center py-3 px-4 bg-[#FEED55] hover:bg-[#ffe566] rounded-lg text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-[#FEED55] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400">
            New to Clerq?{' '}
            <a href="/signup" className="font-semibold text-[#FEED55] hover:text-[#fff3a0] transition">
              Create an account
            </a>
          </p>
          <p className="text-center text-[11px] text-gray-500">
            MFA is required for all accounts.
          </p>
        </div>
      </div>
    </main>
  )
}
