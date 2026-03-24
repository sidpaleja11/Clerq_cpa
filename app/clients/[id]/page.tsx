import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export default async function ClientDetailPage({ params }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: client } = await supabase
    .from('clients')
    .select('*, documents(*), engagements(*), organizers(*), invoices(*)')
    .eq('id', params.id)
    .single()

  if (!client) notFound()

  // Log document access to security_log
  await supabase.from('security_log').insert({
    cpa_id: user.id,
    event_type: 'client_view',
    resource: `client:${params.id}`,
    actor: user.email,
  })

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <a href="/clients" className="text-sm text-blue-600 hover:underline">
          ← All Clients
        </a>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">{client.name}</h1>
        <p className="text-sm text-gray-500">
          {client.entity_type?.toUpperCase()} · {client.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Documents" count={client.documents?.length ?? 0}>
          {client.documents?.length === 0 && (
            <p className="text-sm text-gray-400">No documents yet.</p>
          )}
          {client.documents?.map((doc: { id: string; type: string; status: string }) => (
            <div key={doc.id} className="flex justify-between text-sm py-1 border-b border-gray-100">
              <span>{doc.type ?? 'Unnamed'}</span>
              <span className="text-gray-400">{doc.status}</span>
            </div>
          ))}
        </Section>

        <Section title="Engagements" count={client.engagements?.length ?? 0}>
          {client.engagements?.length === 0 && (
            <p className="text-sm text-gray-400">No engagements yet.</p>
          )}
          {client.engagements?.map((eng: { id: string; year: number; service_type: string; signed_at: string | null }) => (
            <div key={eng.id} className="flex justify-between text-sm py-1 border-b border-gray-100">
              <span>{eng.year} — {eng.service_type}</span>
              <span className={eng.signed_at ? 'text-green-600' : 'text-amber-500'}>
                {eng.signed_at ? 'Signed' : 'Pending'}
              </span>
            </div>
          ))}
        </Section>
      </div>
    </main>
  )
}

function Section({
  title,
  count,
  children,
}: {
  title: string
  count: number
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="font-semibold text-gray-700 mb-3">
        {title} <span className="text-gray-400 font-normal">({count})</span>
      </h2>
      {children}
    </div>
  )
}
