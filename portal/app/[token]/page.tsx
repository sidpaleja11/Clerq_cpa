/**
 * Client Portal — Token-gated page
 *
 * Clients access their portal via a unique URL:
 *   https://portal.clerq.app/<secure-token>
 *
 * The token maps to a client record in Supabase. This page shows:
 * - Pending organizer to complete
 * - Documents to upload
 * - Engagement letter to sign
 * - Invoices to pay
 */

interface Props {
  params: { token: string }
}

export default async function ClientPortalPage({ params }: Props) {
  // TODO: validate token against Supabase, load client context
  const { token } = params

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Tax Portal</h1>
          <p className="text-sm text-gray-500 mb-8">
            Securely upload documents, complete your organizer, and sign agreements.
          </p>

          {/* Placeholder sections — to be wired up in Phase 2 */}
          <Section title="Tax Organizer" status="pending">
            <p className="text-sm text-gray-600">
              Please complete your tax organizer to help us prepare your return accurately.
            </p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
              Start Organizer
            </button>
          </Section>

          <Section title="Document Upload" status="pending">
            <p className="text-sm text-gray-600">
              Upload your W-2s, 1099s, and other tax documents.
            </p>
            <div className="mt-3 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-500">Drag files here or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 25 MB</p>
            </div>
          </Section>

          <Section title="Engagement Letter" status="pending">
            <p className="text-sm text-gray-600">
              Review and sign your engagement letter before we begin preparation.
            </p>
            <button className="mt-3 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50">
              Review & Sign
            </button>
          </Section>
        </div>

        <p className="text-xs text-center text-gray-400 mt-6">
          Secured by Clerq. Your data is encrypted and never shared without your consent.
          <br />
          Portal token: <span className="font-mono">{token.slice(0, 8)}…</span>
        </p>
      </div>
    </main>
  )
}

function Section({
  title,
  status,
  children,
}: {
  title: string
  status: 'pending' | 'complete'
  children: React.ReactNode
}) {
  return (
    <div className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-gray-800">{title}</h2>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            status === 'complete'
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {status === 'complete' ? 'Complete' : 'Needs action'}
        </span>
      </div>
      {children}
    </div>
  )
}
