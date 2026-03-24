import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, clients(name)')
    .order('due_date', { ascending: true })

  const totalOutstanding =
    invoices
      ?.filter((i) => !i.paid_at)
      .reduce((sum, i) => sum + Number(i.amount ?? 0), 0) ?? 0

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">
            Outstanding: <span className="font-semibold text-gray-800">${totalOutstanding.toLocaleString()}</span>
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
          Create Invoice
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Client', 'Amount', 'Due Date', 'Status', 'Reminders'].map((h) => (
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
            {invoices?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                  No invoices yet.
                </td>
              </tr>
            )}
            {invoices?.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {(inv.clients as { name: string })?.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                  ${Number(inv.amount ?? 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      inv.paid_at
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {inv.paid_at ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{inv.reminder_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
