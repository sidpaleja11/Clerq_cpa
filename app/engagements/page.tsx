"use client"

import { useState } from "react"
import Link from "next/link"

const ENGAGEMENTS = [
  {
    id: "1", client: "Sarah Chen", entity: "1040", year: 2026, service: "Tax Preparation",
    fee: 1800, sentDate: "Jan 15", signedDate: "Jan 17", status: "signed",
    scope: ["Federal 1040", "State return", "Quarterly estimates"],
  },
  {
    id: "2", client: "Marcus Webb", entity: "1120-S", year: 2026, service: "Tax Preparation",
    fee: 3200, sentDate: "Jan 15", signedDate: null, status: "pending",
    scope: ["Federal 1120-S", "State return", "K-1 preparation"],
  },
  {
    id: "3", client: "Priya Nair", entity: "1065", year: 2026, service: "Tax + Bookkeeping",
    fee: 5400, sentDate: "Jan 20", signedDate: "Jan 22", status: "signed",
    scope: ["Federal 1065", "K-1 for 3 partners", "Monthly bookkeeping", "Quarterly estimates"],
  },
  {
    id: "4", client: "David Kim", entity: "1040", year: 2026, service: "Tax Preparation",
    fee: 1600, sentDate: "Jan 15", signedDate: null, status: "pending",
    scope: ["Federal 1040", "State return", "IRS notice response"],
  },
  {
    id: "5", client: "Jordan Lee", entity: "1040", year: 2026, service: "Tax + Advisory",
    fee: 2400, sentDate: "Jan 15", signedDate: "Jan 16", status: "signed",
    scope: ["Federal 1040", "State return", "Quarterly estimates", "Tax planning"],
  },
  {
    id: "6", client: "Aisha Patel", entity: "1120-S", year: 2026, service: "Tax + Bookkeeping",
    fee: 4800, sentDate: "—", signedDate: null, status: "not-sent",
    scope: ["Federal 1120-S", "State return", "Monthly bookkeeping"],
  },
  {
    id: "7", client: "Tom Rivera", entity: "1065", year: 2026, service: "Tax Preparation",
    fee: 4200, sentDate: "—", signedDate: null, status: "not-sent",
    scope: ["Federal 1065", "K-1 for 2 partners", "State return"],
  },
  {
    id: "8", client: "Nina Zhao", entity: "1040", year: 2026, service: "Tax + Advisory",
    fee: 2200, sentDate: "Jan 25", signedDate: null, status: "pending",
    scope: ["Federal 1040", "State return", "Quarterly estimates", "Business advisory"],
  },
]

const statusConfig = {
  "signed": { label: "Signed", color: "bg-[#0f2820] text-[#34d399]" },
  "pending": { label: "Pending", color: "bg-[#2a1f0e] text-[#f59e0b]" },
  "not-sent": { label: "Not sent", color: "bg-[#1a1a1e] text-[#555]" },
}

export default function EngagementsPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const signed = ENGAGEMENTS.filter(e => e.status === "signed").length
  const pending = ENGAGEMENTS.filter(e => e.status === "pending").length
  const notSent = ENGAGEMENTS.filter(e => e.status === "not-sent").length
  const totalFees = ENGAGEMENTS.reduce((sum, e) => sum + e.fee, 0)

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id)

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
          <Link href="/invoices" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Invoices</Link>
        </div>
        <div className="px-3 mt-2 mb-2">
          <div className="text-[10px] font-medium text-[#444] tracking-widest uppercase px-2 mb-1">AI Tools</div>
          <Link href="/compose" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Compose Email</Link>
          <Link href="/engagements" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] bg-[#1c2538] text-[#6a9fff]">Engagements</Link>
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
          <div className="text-[15px] font-medium text-[#ddd]">Engagements — 2026</div>
          <button className="px-3.5 py-1.5 rounded-[7px] text-[13px] font-medium bg-[#4f8ef7] text-white hover:bg-[#5d99ff] transition-all">
            + New Engagement
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-3.5 mb-7">
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Total fees 2026</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#e8e8ea]">{formatMoney(totalFees)}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Signed</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#34d399]">{signed}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Awaiting signature</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#f59e0b]">{pending}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Not sent</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#555]">{notSent}</div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_140px_100px_100px_100px_140px] px-5 py-3 border-b border-[#1a1a1e] text-[11px] text-[#444] uppercase tracking-widest">
              <div>Client</div>
              <div>Entity</div>
              <div>Service</div>
              <div>Fee</div>
              <div>Sent</div>
              <div>Signed</div>
              <div>Status</div>
            </div>

            {ENGAGEMENTS.map((eng) => {
              const status = statusConfig[eng.status as keyof typeof statusConfig]
              const initials = eng.client.split(" ").map(n => n[0]).join("")
              const isExpanded = expanded === eng.id

              return (
                <div key={eng.id} className="border-b border-[#161618] last:border-0">
                  <div
                    className="grid grid-cols-[1fr_80px_140px_100px_100px_100px_140px] px-5 py-3.5 hover:bg-[#131315] transition-colors items-center cursor-pointer"
                    onClick={() => toggle(eng.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-[7px] bg-[#1a2d4a] text-[#4f8ef7] flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-[13px] text-[#ccc]">{eng.client}</div>
                        <div className={`text-[10px] transition-transform ${isExpanded ? "rotate-180" : ""} text-[#444]`}>▾</div>
                      </div>
                    </div>
                    <div className="text-[12px] text-[#555]">{eng.entity}</div>
                    <div className="text-[12px] text-[#555]">{eng.service}</div>
                    <div className="text-[13px] font-mono text-[#e8e8ea]">{formatMoney(eng.fee)}</div>
                    <div className="text-[12px] text-[#555]">{eng.sentDate}</div>
                    <div className="text-[12px] text-[#555]">{eng.signedDate ?? "—"}</div>
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <span className={`text-[10.5px] font-semibold font-mono px-2 py-0.5 rounded-[5px] ${status.color}`}>
                        {status.label}
                      </span>
                      {eng.status === "not-sent" && (
                        <button className="text-[11px] px-2 py-0.5 rounded-[5px] bg-[#1a2d4a] text-[#4f8ef7] hover:bg-[#1e3254] transition-all">
                          Send
                        </button>
                      )}
                      {eng.status === "pending" && (
                        <button className="text-[11px] px-2 py-0.5 rounded-[5px] bg-[#2a1f0e] text-[#f59e0b] hover:bg-[#332510] transition-all">
                          Remind
                        </button>
                      )}
                      {eng.status === "signed" && (
                        <button className="text-[11px] px-2 py-0.5 rounded-[5px] bg-[#0f2820] text-[#34d399] hover:bg-[#132e22] transition-all">
                          View
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded scope */}
                  {isExpanded && (
                    <div className="px-5 pb-4 bg-[#0f0f11]">
                      <div className="border-t border-[#1a1a1e] pt-4 grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-[11px] text-[#444] uppercase tracking-widest mb-3">Scope of Services</div>
                          <div className="space-y-2">
                            {eng.scope.map((item, i) => (
                              <div key={i} className="flex items-center gap-2.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#4f8ef7] flex-shrink-0" />
                                <span className="text-[12px] text-[#aaa]">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-[#444] uppercase tracking-widest mb-3">Details</div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-[12px] text-[#555]">Tax year</span>
                              <span className="text-[12px] text-[#ccc]">{eng.year}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[12px] text-[#555]">Annual fee</span>
                              <span className="text-[12px] font-mono text-[#e8e8ea]">{formatMoney(eng.fee)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[12px] text-[#555]">IRC 7216 consent</span>
                              <span className={`text-[12px] ${eng.status === "signed" ? "text-[#34d399]" : "text-[#f59e0b]"}`}>
                                {eng.status === "signed" ? "Signed" : "Pending"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[12px] text-[#555]">Retention</span>
                              <span className="text-[12px] text-[#ccc]">7 years</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}