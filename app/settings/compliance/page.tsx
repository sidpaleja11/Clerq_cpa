"use client"

import { useState } from "react"
import Link from "next/link"

const WISP_ITEMS = [
  { id: "1", category: "Risk Assessment", task: "Annual risk assessment completed", done: true, due: "Jan 2026" },
  { id: "2", category: "Risk Assessment", task: "Risk assessment documented and signed", done: true, due: "Jan 2026" },
  { id: "3", category: "Access Controls", task: "MFA enforced on all user accounts", done: true, due: "Ongoing" },
  { id: "4", category: "Access Controls", task: "30-minute session timeout configured", done: true, due: "Ongoing" },
  { id: "5", category: "Access Controls", task: "Access logs reviewed quarterly", done: false, due: "Apr 2026" },
  { id: "6", category: "Encryption", task: "AES-256 encryption at rest for all PII", done: true, due: "Ongoing" },
  { id: "7", category: "Encryption", task: "TLS 1.2+ enforced for all data in transit", done: true, due: "Ongoing" },
  { id: "8", category: "Vendor Management", task: "All subprocessors documented", done: true, due: "Jan 2026" },
  { id: "9", category: "Vendor Management", task: "Supabase DPA executed", done: false, due: "Apr 2026" },
  { id: "10", category: "Vendor Management", task: "Anthropic DPA executed", done: false, due: "Apr 2026" },
  { id: "11", category: "Incident Response", task: "Breach notification plan documented", done: true, due: "Jan 2026" },
  { id: "12", category: "Incident Response", task: "FTC 30-day notification procedure ready", done: true, due: "Ongoing" },
  { id: "13", category: "WISP Document", task: "WISP written using IRS Pub 5708 template", done: true, due: "Jan 2026" },
  { id: "14", category: "WISP Document", task: "WISP annual review scheduled", done: false, due: "Jan 2027" },
  { id: "15", category: "Client Consent", task: "IRC 7216 consent in onboarding flow", done: true, due: "Ongoing" },
  { id: "16", category: "Client Consent", task: "No AI training clause in Terms of Service", done: true, due: "Ongoing" },
]

const SUBPROCESSORS = [
  { name: "Supabase", role: "Database & Auth", location: "US East", dpa: true },
  { name: "Vercel", role: "Frontend hosting", location: "US", dpa: true },
  { name: "Anthropic", role: "AI generation", location: "US", dpa: false },
  { name: "Resend", role: "Transactional email", location: "US", dpa: true },
  { name: "Stripe", role: "Payment processing", location: "US", dpa: true },
  { name: "Railway", role: "PDF microservice", location: "US", dpa: false },
]

const categories = [...new Set(WISP_ITEMS.map(i => i.category))]

export default function CompliancePage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Risk Assessment")

  const completed = WISP_ITEMS.filter(i => i.done).length
  const total = WISP_ITEMS.length
  const pct = Math.round((completed / total) * 100)

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
          <Link href="/engagements" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Engagements</Link>
        </div>
        <div className="px-3 mt-2">
          <div className="text-[10px] font-medium text-[#444] tracking-widest uppercase px-2 mb-1">Settings</div>
          <Link href="/settings/compliance" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] bg-[#1c2538] text-[#6a9fff]">Compliance</Link>
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
          <div className="text-[15px] font-medium text-[#ddd]">Compliance</div>
          <div className="text-[12px] text-[#444] font-mono">FTC Safeguards Rule · GLBA · IRC 7216</div>
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          <div className="grid grid-cols-2 gap-6">

            {/* Left col — WISP checklist */}
            <div>
              {/* Progress card */}
              <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[13px] font-medium text-[#bbb]">WISP Compliance</div>
                  <div className="text-[13px] font-mono text-[#e8e8ea]">{completed}/{total}</div>
                </div>
                <div className="h-2 bg-[#1a1a1e] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pct === 100 ? "#34d399" : pct > 70 ? "#4f8ef7" : "#f59e0b"
                    }}
                  />
                </div>
                <div className="text-[11px] text-[#555]">{pct}% complete — {total - completed} items remaining</div>
              </div>

              {/* Category checklists */}
              <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden">
                {categories.map((cat, i) => {
                  const items = WISP_ITEMS.filter(item => item.category === cat)
                  const catDone = items.filter(i => i.done).length
                  const isExpanded = expandedCategory === cat

                  return (
                    <div key={cat} className={`border-b border-[#161618] last:border-0`}>
                      <div
                        className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-[#131315] transition-colors"
                        onClick={() => setExpandedCategory(isExpanded ? null : cat)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${catDone === items.length ? "bg-[#34d399]" : catDone > 0 ? "bg-[#f59e0b]" : "bg-[#333]"}`} />
                          <span className="text-[13px] text-[#ccc]">{cat}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-mono text-[#555]">{catDone}/{items.length}</span>
                          <span className={`text-[10px] text-[#444] transition-transform ${isExpanded ? "rotate-180" : ""}`}>▾</span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-5 pb-3 bg-[#0f0f11]">
                          <div className="space-y-2 pt-2">
                            {items.map(item => (
                              <div key={item.id} className="flex items-center justify-between py-1.5">
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-4 h-4 rounded-[4px] flex-shrink-0 flex items-center justify-center ${
                                    item.done ? "bg-[#0f2820] border border-[#34d399]/30" : "border border-[#333]"
                                  }`}>
                                    {item.done && (
                                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path d="M2 5L4 7L8 3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    )}
                                  </div>
                                  <span className={`text-[12px] ${item.done ? "text-[#555] line-through" : "text-[#aaa]"}`}>
                                    {item.task}
                                  </span>
                                </div>
                                <span className={`text-[11px] font-mono flex-shrink-0 ml-4 ${item.done ? "text-[#444]" : "text-[#f59e0b]"}`}>
                                  {item.due}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right col */}
            <div className="space-y-4">
              {/* Subprocessors */}
              <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#1a1a1e]">
                  <div className="text-[13px] font-medium text-[#bbb]">Subprocessors</div>
                  <div className="text-[11px] text-[#444] mt-0.5">All vendors with access to client data</div>
                </div>
                {SUBPROCESSORS.map((sp, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-[#161618] last:border-0">
                    <div>
                      <div className="text-[13px] text-[#ccc]">{sp.name}</div>
                      <div className="text-[11px] text-[#444]">{sp.role} · {sp.location}</div>
                    </div>
                    <span className={`text-[10.5px] font-semibold font-mono px-2 py-0.5 rounded-[5px] ${
                      sp.dpa ? "bg-[#0f2820] text-[#34d399]" : "bg-[#2a1f0e] text-[#f59e0b]"
                    }`}>
                      {sp.dpa ? "DPA signed" : "DPA pending"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Key requirements */}
              <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
                <div className="text-[13px] font-medium text-[#bbb] mb-4">Key Requirements</div>
                <div className="space-y-3">
                  {[
                    { label: "MFA enforced", status: true, note: "All accounts" },
                    { label: "AES-256 encryption", status: true, note: "PII fields" },
                    { label: "Session timeout", status: true, note: "30 minutes" },
                    { label: "Security audit log", status: true, note: "Immutable" },
                    { label: "IRC 7216 consent", status: true, note: "In onboarding" },
                    { label: "WISP documented", status: true, note: "IRS Pub 5708" },
                    { label: "Breach response plan", status: true, note: "30-day FTC" },
                    { label: "SOC 2 Type 1", status: false, note: "6mo post-launch" },
                  ].map((req, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${req.status ? "bg-[#34d399]" : "bg-[#333]"}`} />
                        <span className={`text-[12px] ${req.status ? "text-[#ccc]" : "text-[#444]"}`}>{req.label}</span>
                      </div>
                      <span className="text-[11px] text-[#444]">{req.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FTC penalties warning */}
              <div className="bg-[#2a1010] border border-[#f87171]/20 rounded-[10px] p-4">
                <div className="text-[12px] font-medium text-[#f87171] mb-1">FTC Safeguards Rule</div>
                <div className="text-[11px] text-[#f87171]/70 leading-relaxed">
                  Penalties up to $50,000 per violation · $46,517/day for ongoing non-compliance · 30-day breach notification required for incidents affecting 500+ consumers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}