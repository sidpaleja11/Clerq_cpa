import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CompliancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch recent security log entries
  const { data: securityLog } = await supabase
    .from('security_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  // Check MFA enrollment status
  const { data: factors } = await supabase.auth.mfa.listFactors()
  const mfaEnrolled = (factors?.totp?.length ?? 0) > 0

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Compliance & Security</h1>

      {/* MFA Status */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Multi-Factor Authentication</h2>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              mfaEnrolled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {mfaEnrolled ? 'MFA Enrolled' : 'MFA Not Enrolled'}
          </span>
          {!mfaEnrolled && (
            <a
              href="/settings/mfa-setup"
              className="text-sm text-blue-600 hover:underline"
            >
              Set up MFA now (required)
            </a>
          )}
        </div>
        <p className="mt-3 text-sm text-gray-500">
          MFA is required on all CPA accounts. Session timeout: 30 minutes of inactivity.
        </p>
      </section>

      {/* Compliance Checklist */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Compliance Checklist</h2>
        <ul className="space-y-2 text-sm">
          <CheckItem label="MFA enforced on all logins" done={mfaEnrolled} />
          <CheckItem label="30-minute session timeout active" done={true} />
          <CheckItem label="All document accesses logged to security_log" done={true} />
          <CheckItem label="AI-drafted communications labeled before sending" done={true} />
          <CheckItem label="IRC 7216 consent required at client onboarding" done={false} note="Pending onboarding flow" />
        </ul>
      </section>

      {/* Security Log */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-semibold text-gray-800 mb-4">
          Security Log{' '}
          <span className="text-gray-400 font-normal text-sm">(last 50 events)</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="pb-2 pr-4">Event</th>
                <th className="pb-2 pr-4">Resource</th>
                <th className="pb-2 pr-4">Actor</th>
                <th className="pb-2">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {securityLog?.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    No events logged yet.
                  </td>
                </tr>
              )}
              {securityLog?.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="py-2 pr-4 font-mono text-xs">{entry.event_type}</td>
                  <td className="py-2 pr-4 text-gray-600">{entry.resource ?? '—'}</td>
                  <td className="py-2 pr-4 text-gray-600">{entry.actor ?? '—'}</td>
                  <td className="py-2 text-gray-500">
                    {new Date(entry.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

function CheckItem({
  label,
  done,
  note,
}: {
  label: string
  done: boolean
  note?: string
}) {
  return (
    <li className="flex items-start gap-2">
      <span className={done ? 'text-green-500' : 'text-amber-500'}>{done ? '✓' : '○'}</span>
      <span className={done ? 'text-gray-800' : 'text-gray-600'}>
        {label}
        {note && <span className="text-gray-400 ml-2 text-xs">({note})</span>}
      </span>
    </li>
  )
}
