"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

type Engagement = {
  id: string
  client_name: string
  entity_type: string
  year: number | null
  service_type: string | null
  fee: number | null
  signed_at: string | null
  scope: string[] | null
  status: "signed" | "pending"
}

const statusConfig = {
  "signed": { label: "Signed", color: "bg-[#0f2820] text-[#34d399]" },
  "pending": { label: "Pending", color: "bg-[#2a1f0e] text-[#f59e0b]" },
}

function displayEntityType(raw: string | null): string {
  const map: Record<string, string> = {
    '1040': '1040', '1120': '1120', '1120s': '1120-S', '1065': '1065', '1041': '1041',
  }
  return raw ? (map[raw.toLowerCase()] ?? raw) : '—'
}

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export default function EngagementsPage() {
  const [engagements, setEngagements] = useState<Engagement[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('engagements')
      .select('id, year, service_type, fee, signed_at, scope, created_at, clients(name, entity_type)')
      .order('created_at', { ascending: false })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }) => {
        if (data) {
          setEngagements(data.map((e: any) => ({
            id: e.id,
            client_name: e.clients?.name ?? 'Unknown',
            entity_type: displayEntityType(e.clients?.entity_type),
            year: e.year,
            service_type: e.service_type,
            fee: e.fee,
            signed_at: e.signed_at,
            scope: Array.isArray(e.scope) ? e.scope : null,
            status: e.signed_at ? "signed" : "pending",
          })))
        }
        setLoading(false)
      })
  }, [])

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id)

  const signed = engagements.filter(e => e.status === "signed").length
  const pending = engagements.filter(e => e.status === "pending").length
  const totalFees = engagements.reduce((sum, e) => sum + (e.fee ?? 0), 0)

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
          <div className="text-[15px] font-medium text-[#ddd]">Engagements</div>
          <button className="px-3.5 py-1.5 rounded-[7px] text-[13px] font-medium bg-[#4f8ef7] text-white hover:bg-[#5d99ff] transition-all">
            + New Engagement
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-3.5 mb-7">
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Total fees</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#e8e8ea]">{loading ? "—" : formatMoney(totalFees)}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Signed</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#34d399]">{loading ? "—" : signed}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Awaiting signature</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#f59e0b]">{loading ? "—" : pending}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Total</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#e8e8ea]">{loading ? "—" : engagements.length}</div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_140px_100px_100px_140px] px-5 py-3 border-b border-[#1a1a1e] text-[11px] text-[#444] uppercase tracking-widest">
              <div>Client</div>
              <div>Entity</div>
              <div>Service</div>
              <div>Fee</div>
              <div>Signed</div>
              <div>Status</div>
            </div>

            {loading ? (
              <div className="px-5 py-10 text-center text-[12px] text-[#444]">Loading engagements...</div>
            ) : engagements.length === 0 ? (
              <div className="px-5 py-10 text-center text-[12px] text-[#444]">No engagements yet. Create your first engagement letter to get started.</div>
            ) : (
              engagements.map((eng) => {
                const status = statusConfig[eng.status]
                const initials = eng.client_name.split(" ").map(n => n[0]).join("").slice(0, 2)
                const isExpanded = expanded === eng.id

                return (
                  <div key={eng.id} className="border-b border-[#161618] last:border-0">
                    <div
                      className="grid grid-cols-[1fr_80px_140px_100px_100px_140px] px-5 py-3.5 hover:bg-[#131315] transition-colors items-center cursor-pointer"
                      onClick={() => toggle(eng.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-[7px] bg-[#1a2d4a] text-[#4f8ef7] flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                          {initials}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[13px] text-[#ccc]">{eng.client_name}</div>
                          {eng.scope && eng.scope.length > 0 && (
                            <div className={`text-[10px] transition-transform ${isExpanded ? "rotate-180" : ""} text-[#444]`}>▾</div>
                          )}
                        </div>
                      </div>
                      <div className="text-[12px] text-[#555]">{eng.entity_type}</div>
                      <div className="text-[12px] text-[#555]">{eng.service_type ?? "—"}</div>
                      <div className="text-[13px] font-mono text-[#e8e8ea]">{eng.fee ? formatMoney(eng.fee) : "—"}</div>
                      <div className="text-[12px] text-[#555]">{formatDate(eng.signed_at)}</div>
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <span className={`text-[10.5px] font-semibold font-mono px-2 py-0.5 rounded-[5px] ${status.color}`}>
                          {status.label}
                        </span>
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
                    {isExpanded && eng.scope && eng.scope.length > 0 && (
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
                                <span className="text-[12px] text-[#ccc]">{eng.year ?? "—"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[12px] text-[#555]">Annual fee</span>
                                <span className="text-[12px] font-mono text-[#e8e8ea]">{eng.fee ? formatMoney(eng.fee) : "—"}</span>
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
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
