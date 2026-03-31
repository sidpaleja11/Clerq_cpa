'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SmokeyBackground } from '@/components/ui/login-form'
import { User, Lock, Building2, ArrowRight } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firmName, setFirmName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firmName }),
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error)
      setLoading(false)
      return
    }

    if (json.emailConfirmationRequired) {
      setDone(true)
      setLoading(false)
      return
    }

    router.push('/mfa-setup')
  }

  if (done) {
    return (
      <main className="relative w-screen h-screen bg-[#050810]">
        <SmokeyBackground color="#2a2800" className="absolute inset-0" />
        <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
          <div className="w-full max-w-sm p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl text-center space-y-4">
            <div className="text-4xl">📧</div>
            <h2 className="text-xl font-bold text-white">Check your email</h2>
            <p className="text-sm text-gray-300">
              We sent a confirmation link to <strong className="text-white">{email}</strong>.
              Click it to activate your account, then come back to sign in.
            </p>
            <a href="/login" className="inline-block mt-4 text-sm text-[#FEED55] hover:text-[#fff3a0] transition">
              Back to login
            </a>
          </div>
        </div>
      </main>
    )
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
            <p className="text-sm text-gray-300">Create your CPA workspace</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-8">
            {/* Firm Name */}
            <div className="relative z-0">
              <input
                type="text"
                id="floating_firm"
                value={firmName}
                onChange={e => setFirmName(e.target.value)}
                placeholder=" "
                className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-400/50 appearance-none focus:outline-none focus:ring-0 focus:border-[#FEED55] peer"
              />
              <label
                htmlFor="floating_firm"
                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FEED55] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                <Building2 className="inline-block mr-2 -mt-1" size={14} />
                Firm / Practice name
              </label>
            </div>

            {/* Email */}
            <div className="relative z-0">
              <input
                type="email"
                id="floating_email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder=" "
                required
                className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-400/50 appearance-none focus:outline-none focus:ring-0 focus:border-[#FEED55] peer"
              />
              <label
                htmlFor="floating_email"
                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FEED55] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                <User className="inline-block mr-2 -mt-1" size={14} />
                Email address <span className="text-red-400">*</span>
              </label>
            </div>

            {/* Password */}
            <div className="relative z-0">
              <input
                type="password"
                id="floating_password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder=" "
                required
                minLength={8}
                className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-400/50 appearance-none focus:outline-none focus:ring-0 focus:border-[#FEED55] peer"
              />
              <label
                htmlFor="floating_password"
                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FEED55] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                <Lock className="inline-block mr-2 -mt-1" size={14} />
                Password <span className="text-red-400">*</span>
              </label>
              <p className="mt-1.5 text-[11px] text-gray-500">Minimum 8 characters</p>
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
              {loading ? 'Creating account…' : 'Create account'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-[#FEED55] hover:text-[#fff3a0] transition">
              Sign in
            </a>
          </p>
          <p className="text-center text-[11px] text-gray-500">
            MFA setup is required after creating your account.
          </p>
        </div>
      </div>
    </main>
  )
}
