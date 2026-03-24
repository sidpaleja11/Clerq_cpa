export default async function DashboardPage() {
  const clientCount = 0
  const openOrganizerCount = 0
  const unpaidInvoiceCount = 0

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Active Clients" value={clientCount} href="/clients" />
        <StatCard label="Open Organizers" value={openOrganizerCount} href="/organizers" />
        <StatCard label="Unpaid Invoices" value={unpaidInvoiceCount} href="/invoices" />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>Phase 0 — Foundation.</strong> Auth, schema, and AI routes are live.
        Feature UI is being built. Check back soon.
      </div>
    </main>
  )
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string
  value: number
  href: string
}) {
  return (
    <a
      href={href}
      className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </a>
  )
}
