"use client"

import { useState } from "react"
import Link from "next/link"

const INVOICES = [
  { id: "INV-1042", client: "David Kim", entity: "1040", amount: 2400, issued: "Mar 1", due: "Mar 15", status: "overdue", paid: null, service: "Tax Preparation" },
  { id: "INV-1041", client: "Aisha Patel", entity: "1120-S", amount: 3200, issued: "Mar 1", due: "Mar 15", status: "overdue", paid: null, service: "Tax + Bookkeeping" },
  { id: "INV-1043", client: "Tom Rivera", entity: "1065", amount: 4100, issued: "Mar 5", due: "Mar 30", status: "unpaid", paid: null, service: "Partnership Return" },
  { id: "INV-1044", client: "Marcus Webb", entity: "1120-S", amount: 2800, issued: "Mar 8", due: "Apr 1", status: "unpaid", paid: null, service: "Tax Preparation" },
  { id: "INV-1045", client: "Nina Zhao", entity: "1040", amount: 1800, issued: "Mar 10", due: "Apr 5", status: "unpaid", paid: null, service: "Tax + Advisory" },
  { id: "INV-1038", client: "Sarah Chen", entity: "1040", amount: 3200, issued: "Feb 15", due: "Mar 1", status: "paid", paid: "Mar 1", service: "Tax Preparation" },
  { id: "INV-1039", client: "Jordan Lee", entity: "1040", amount: 1600, issued: "Feb 20", due: "Mar 5", status: "paid", paid: "Mar 3", service: "Tax Preparation" },
  { id: "INV-1040", client: "Priya Nair", entity: "1065", amount: 4800, issued: "Feb 25", due: "Mar 10", status: "paid", paid: "Mar 8", service: "Partnership Return" },
]

const statusConfig = {
  "overdue": { label: "Overdue", color: "bg-[#2a1010] text-[#f87171]" },
  "unpaid": { label: "Unpaid", color: "bg-[#2a1f0e] text-[#f59e0b]" },
  "paid": { label: "Paid", color: "bg-[#0f2820] text-[#34d399]" },
}

export default function InvoicesPage() {
  const [filter, setFilter] = useState<"all" | "unpaid" | "overdue" | "paid">("all")

  const totalOutstanding = INVOICES.filter(i => i.status !== "paid").reduce((sum, i) => sum + i.amount, 0)
  const totalOverdue = INVOICES.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0)
  const totalPaid = INVOICES.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)
  const overdueCount = INVOICES.filter(i => i.status === "overdue").length

  const filtered = filter === "all" ? INVOICES : INVOICES.filter(i => i.status === filter)

  const formatMoney = (n: number) => `$${n.toLocaleString()}`

  return (
    <div className="flex h-screen bg-[#0d0d0f] text-[#e8e8ea] font-sans overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-[220px] flex-shrink-0 bg-[#111113] border-r border-[#1e1e22] flex flex-col py-5">
        <div className="px-5 pb-6 border-b border-[#1e1e22] mb-4">
          <div className="text-[18px] font-semibold tracking-tight text-white">
            cler<span className="text-[#4f8ef7]">q</span>
          </div>
          <div className="text-[11px] text-[#555] mt-0.5 tracking-widest font-mono">CPA WORKFLOW</div>
        </div>
        <div className="px-3 mb-2">
          <div className="text-[10px] font-medium text-[#444] tracking-widest uppercase px-2 mb-1">Workspace</div>
          <Link href="/dashboard" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Dashboard</Link>
          <Link href="/clients" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Clients</Link>
          <Link href="/organizers" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Organizers</Link>
          <Link href="/invoices" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] bg-[#1c2538] text-[#6a9fff]">Invoices</Link>
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
            <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#4f8ef7] flex items-center justify-center text-[11px] font-semibold text-[#aac8ff]">TR</div>
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
          <button className="px-3.5 py-1.5 rounded-[7px] text-[13px] font-medium bg-[#4f8ef7] text-white hover:bg-[#5d99ff] transition-all">
            + New Invoice
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-3.5 mb-7">
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Outstanding</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#e8e8ea]">{formatMoney(totalOutstanding)}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Overdue</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#f87171]">{formatMoney(totalOverdue)}</div>
              <div className="text-[11px] text-[#f87171] mt-1">{overdueCount} invoices</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Collected this month</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#34d399]">{formatMoney(totalPaid)}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Total invoices</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#e8e8ea]">{INVOICES.length}</div>
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
                    ? "bg-[#1c2538] text-[#6a9fff]"
                    : "text-[#555] hover:text-[#aaa] hover:bg-[#1a1a1e]"
                }`}
              >
                {f === "all" ? `All (${INVOICES.length})` :
                 f === "overdue" ? `Overdue (${INVOICES.filter(i => i.status === "overdue").length})` :
                 f === "unpaid" ? `Unpaid (${INVOICES.filter(i => i.status === "unpaid").length})` :
                 `Paid (${INVOICES.filter(i => i.status === "paid").length})`}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden">
            <div className="grid grid-cols-[80px_1fr_120px_100px_100px_100px_120px] px-5 py-3 border-b border-[#1a1a1e] text-[11px] text-[#444] uppercase tracking-widest">
              <div>Invoice</div>
              <div>Client</div>
              <div>Service</div>
              <div>Amount</div>
              <div>Issued</div>
              <div>Due</div>
              <div>Status</div>
            </div>

            {filtered.map((inv) => {
              const status = statusConfig[inv.status as keyof typeof statusConfig]
              const initials = inv.client.split(" ").map(n => n[0]).join("")

              return (
                <div key={inv.id} className="grid grid-cols-[80px_1fr_120px_100px_100px_100px_120px] px-5 py-3.5 border-b border-[#161618] last:border-0 hover:bg-[#131315] transition-colors items-center">
                  <div className="text-[12px] font-mono text-[#555]">{inv.id}</div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-[7px] bg-[#1a2d4a] text-[#4f8ef7] flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                      {initials}
                    </div>
                    <div>
                      <div className="text-[13px] text-[#ccc]">{inv.client}</div>
                      <div className="text-[11px] text-[#444]">{inv.entity}</div>
                    </div>
                  </div>
                  <div className="text-[12px] text-[#555]">{inv.service}</div>
                  <div className="text-[13px] font-mono font-medium text-[#e8e8ea]">{formatMoney(inv.amount)}</div>
                  <div className="text-[12px] text-[#555]">{inv.issued}</div>
                  <div className={`text-[12px] ${inv.status === "overdue" ? "text-[#f87171]" : "text-[#555]"}`}>
                    {inv.due}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10.5px] font-semibold font-mono px-2 py-0.5 rounded-[5px] ${status.color}`}>
                      {status.label}
                    </span>
                    {inv.status !== "paid" && (
                      <button className="text-[11px] px-2 py-0.5 rounded-[5px] bg-[#1a2d4a] text-[#4f8ef7] hover:bg-[#1e3254] transition-all">
                        Remind
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}