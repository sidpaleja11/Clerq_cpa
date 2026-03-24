import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OrganizersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: organizers } = await supabase
    .from('organizers')
    .select('*, clients(name, entity_type)')
    .order('created_at', { ascending: false })

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tax Organizers</h1>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
          Send Organizer
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Client', 'Year', 'Template', 'Status', 'Sent', 'Completed', 'Reminders'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {organizers?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                  No organizers yet. Send one to get started.
                </td>
              </tr>
            )}
            {organizers?.map((org) => (
              <tr key={org.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {(org.clients as { name: string })?.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{org.year}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{org.template_type}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={org.status} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {org.sent_at ? new Date(org.sent_at).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {org.completed_at ? new Date(org.completed_at).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{org.reminder_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    sent: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
  }
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${styles[status] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  )
}
