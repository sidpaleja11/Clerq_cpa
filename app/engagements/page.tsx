import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function EngagementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: engagements } = await supabase
    .from('engagements')
    .select('*, clients(name, entity_type)')
    .order('created_at', { ascending: false })

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Engagement Letters</h1>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
          Generate Engagement
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Client', 'Year', 'Service', 'Fee', 'Status', 'Signed'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {engagements?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                  No engagement letters yet.
                </td>
              </tr>
            )}
            {engagements?.map((eng) => (
              <tr key={eng.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {(eng.clients as { name: string })?.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{eng.year}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{eng.service_type}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {eng.fee ? `$${Number(eng.fee).toLocaleString()}` : '—'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      eng.signed_at
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {eng.signed_at ? 'Signed' : 'Pending Signature'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {eng.signed_at ? new Date(eng.signed_at).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
