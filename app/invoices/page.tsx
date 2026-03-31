"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import NewInvoiceModal from "@/components/ui/new-invoice-modal"

type Invoice = {
  id: string
  client_id: string
  client_name: string
  entity_type: string
  amount: number
  due_date: string | null
  paid_at: string | null
  created_at: string
  reminder_count: number
  status: "paid" | "overdue" | "unpaid"
}

const statusConfig = {
  "overdue": { label: "Overdue", color: "bg-[#2a1010] text-[#f87171]" },
  "unpaid": { label: "Unpaid", color: "bg-[#2a1f0e] text-[#f59e0b]" },
  "paid": { label: "Paid", color: "bg-[#0f2820] text-[#34d399]" },
}

function displayEntityType(raw: string | null): string {
  const map: Record<string, string> = {
    '1040': '1040', '1120': '1120', '1120s': '1120-S', '1065': '1065', '1041': '1041',
  }
  return raw ? (map[raw.toLowerCase()] ?? raw) : '—'
}

function deriveStatus(paid_at: string | null, due_date: string | null): "paid" | "overdue" | "unpaid" {
  if (paid_at) return "paid"
  if (due_date && new Date(due_date) < new Date()) return "overdue"
  return "unpaid"
}

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function shortId(uuid: string): string {
  return `INV-${uuid.slice(-4).toUpperCase()}`
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unpaid" | "overdue" | "paid">("all")
  const [showModal, setShowModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('invoices')
      .select('id, client_id, amount, due_date, paid_at, reminder_count, created_at, clients(name, entity_type)')
      .order('created_at', { ascending: false })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }) => {
        if (data) {
          setInvoices(data.map((inv: any) => ({
            id: inv.id,
            client_id: inv.client_id,
            client_name: inv.clients?.name ?? 'Unknown',
            entity_type: displayEntityType(inv.clients?.entity_type),
            amount: inv.amount ?? 0,
            due_date: inv.due_date,
            paid_at: inv.paid_at,
            created_at: inv.created_at,
            reminder_count: inv.reminder_count ?? 0,
            status: deriveStatus(inv.paid_at, inv.due_date),
          })))
        }
        setLoading(false)
      })
  }, [refreshKey])

  const filtered = filter === "all" ? invoices : invoices.filter(i => i.status === filter)

  const totalOutstanding = invoices.filter(i => i.status !== "paid").reduce((sum, i) => sum + i.amount, 0)
  const totalOverdue = invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0)
  const totalPaid = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)
  const overdueCount = invoices.filter(i => i.status === "overdue").length

  const formatMoney = (n: number) => `$${n.toLocaleString()}`

  return (
    <div className="flex h-screen bg-[#0d0d0f] text-[#e8e8ea] font-sans overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-[220px] flex-shrink-0 bg-[#111113] border-r border-[#1e1e22] flex flex-col py-5">
        <div className="px-5 pb-6 border-b border-[#1e1e22] mb-4">
          <div className="text-[18px] font-semibold tracking-tight text-white">
            cler<span className="text-[#FEED55]">q</span>
          </div>
          <div className="text-[11px] text-[#555] mt-0.5 tracking-widest font-mono">CPA WORKFLOW</div>
        </div>
        <div className="px-3 mb-2">
          <div className="text-[10px] font-medium text-[#444] tracking-widest uppercase px-2 mb-1">Workspace</div>
          <Link href="/dashboard" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Dashboard</Link>
          <Link href="/clients" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Clients</Link>
          <Link href="/organizers" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Organizers</Link>
          <Link href="/invoices" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] bg-[#1f1d00] text-[#ffe566]">Invoices</Link>
        </div>
        <div className="px-3 mt-2 mb-2">
          <div className="text-[10px] font-medium text-[#444] tracking-widest uppercase px-2 mb-1">AI Tools</div>
          <Link href="/compose" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Compose Email</Link>
          <Link href="/engagements" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Engagements</Link>
        </div>
        <div className="px-3 mt-2">
          <div className="text-[10px] font-medium text-[#444] tracking-widest uppercase px-2 mb-1">Settings</div>
          <Link href="/settings/compliance" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Compliance</Link>
        </div>
        <div className="mt-auto px-5 pt-4 border-t border-[#1e1e22]">
          <div className="flex items-center gap-2.5">
            <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#262200] to-[#FEED55] flex items-center justify-center text-[11px] font-semibold text-[#fff8d0]">TR</div>
            <div>
              <div className="text-[13px] font-medium text-[#bbb]">Taran R.</div>
              <div className="text-[11px] text-[#555]">Pro plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-7 py-[18px] border-b border-[#1a1a1e] bg-[#0d0d0f]">
          <div className="text-[15px] font-medium text-[#ddd]">Invoices</div>
          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-1.5 rounded-[7px] text-[13px] font-medium bg-[#FEED55] text-[#0d0d0f] hover:bg-[#ffe566] transition-all"
          >
            + New Invoice
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-3.5 mb-7">
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Outstanding</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#e8e8ea]">{loading ? "—" : formatMoney(totalOutstanding)}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Overdue</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#f87171]">{loading ? "—" : formatMoney(totalOverdue)}</div>
              {!loading && overdueCount > 0 && <div className="text-[11px] text-[#f87171] mt-1">{overdueCount} invoice{overdueCount !== 1 ? 's' : ''}</div>}
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Collected</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#34d399]">{loading ? "—" : formatMoney(totalPaid)}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Total invoices</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#e8e8ea]">{loading ? "—" : invoices.length}</div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-4">
            {(["all", "overdue", "unpaid", "paid"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-[7px] text-[12px] font-medium transition-all capitalize ${
                  filter === f
                    ? "bg-[#1f1d00] text-[#ffe566]"
                    : "text-[#555] hover:text-[#aaa] hover:bg-[#1a1a1e]"
                }`}
              >
                {f === "all" ? `All (${invoices.length})` :
                 f === "overdue" ? `Overdue (${invoices.filter(i => i.status === "overdue").length})` :
                 f === "unpaid" ? `Unpaid (${invoices.filter(i => i.status === "unpaid").length})` :
                 `Paid (${invoices.filter(i => i.status === "paid").length})`}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden">
            <div className="grid grid-cols-[80px_1fr_100px_100px_100px_120px] px-5 py-3 border-b border-[#1a1a1e] text-[11px] text-[#444] uppercase tracking-widest">
              <div>Invoice</div>
              <div>Client</div>
              <div>Amount</div>
              <div>Issued</div>
              <div>Due</div>
              <div>Status</div>
            </div>

            {loading ? (
              <div className="px-5 py-10 text-center text-[12px] text-[#444]">Loading invoices...</div>
            ) : filtered.length === 0 ? (
              <div className="px-5 py-10 text-center text-[12px] text-[#444]">
                {invoices.length === 0 ? "No invoices yet." : `No ${filter} invoices.`}
              </div>
            ) : (
              filtered.map((inv) => {
                const status = statusConfig[inv.status]
                const initials = inv.client_name.split(" ").map(n => n[0]).join("").slice(0, 2)

                return (
                  <div key={inv.id} className="grid grid-cols-[80px_1fr_100px_100px_100px_120px] px-5 py-3.5 border-b border-[#161618] last:border-0 hover:bg-[#131315] transition-colors items-center">
                    <div className="text-[12px] font-mono text-[#555]">{shortId(inv.id)}</div>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-[7px] bg-[#262200] text-[#FEED55] flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                        {initials}
                      </div>
                      <div>
                        <div className="text-[13px] text-[#ccc]">{inv.client_name}</div>
                        <div className="text-[11px] text-[#444]">{inv.entity_type}</div>
                      </div>
                    </div>
                    <div className="text-[13px] font-mono font-medium text-[#e8e8ea]">{formatMoney(inv.amount)}</div>
                    <div className="text-[12px] text-[#555]">{formatDate(inv.created_at)}</div>
                    <div className={`text-[12px] ${inv.status === "overdue" ? "text-[#f87171]" : "text-[#555]"}`}>
                      {formatDate(inv.due_date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10.5px] font-semibold font-mono px-2 py-0.5 rounded-[5px] ${status.color}`}>
                        {status.label}
                      </span>
                      {inv.status !== "paid" && (
                        <button className="text-[11px] px-2 py-0.5 rounded-[5px] bg-[#262200] text-[#FEED55] hover:bg-[#222000] transition-all">
                          Remind
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <NewInvoiceModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setRefreshKey(k => k + 1); setLoading(true) }}
        />
      )}
    </div>
  )
}
