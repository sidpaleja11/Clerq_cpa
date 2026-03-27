"use client"

import { useState } from "react"
import Link from "next/link"

const ORGANIZERS = [
  {
    id: "1", client: "Sarah Chen", entity: "1040", sentDate: "Mar 1", status: "completed", docsReceived: 8, docsTotal: 8, reminder: 0,
    docs: [
      { name: "W-2 from employer", done: true },
      { name: "1099-NEC freelance income", done: true },
      { name: "Bank statements (Q4)", done: true },
      { name: "Prior year tax return", done: true },
      { name: "Mortgage interest statement", done: true },
      { name: "Charitable donation receipts", done: true },
      { name: "Health insurance 1095-A", done: true },
      { name: "Student loan interest 1098-E", done: true },
    ]
  },
  {
    id: "2", client: "Marcus Webb", entity: "1120-S", sentDate: "Mar 1", status: "awaiting", docsReceived: 2, docsTotal: 6, reminder: 2,
    docs: [
      { name: "Business bank statements", done: true },
      { name: "Prior year 1120-S return", done: true },
      { name: "Payroll records", done: false },
      { name: "Business expenses summary", done: false },
      { name: "Shareholder loan documents", done: false },
      { name: "Fixed asset additions", done: false },
    ]
  },
  {
    id: "3", client: "Priya Nair", entity: "1065", sentDate: "Mar 3", status: "awaiting", docsReceived: 4, docsTotal: 9, reminder: 1,
    docs: [
      { name: "Partnership bank statements", done: true },
      { name: "Prior year 1065 return", done: true },
      { name: "Partner ownership percentages", done: true },
      { name: "Capital account balances", done: true },
      { name: "Business income summary", done: false },
      { name: "Business expense summary", done: false },
      { name: "Rental income records", done: false },
      { name: "Depreciation schedules", done: false },
      { name: "Loan agreements", done: false },
    ]
  },
  {
    id: "4", client: "David Kim", entity: "1040", sentDate: "—", status: "not-sent", docsReceived: 0, docsTotal: 7, reminder: 0,
    docs: [
      { name: "W-2 from employer", done: false },
      { name: "1099 forms", done: false },
      { name: "Bank statements", done: false },
      { name: "Prior year tax return", done: false },
      { name: "IRS CP2000 notice", done: false },
      { name: "Investment statements", done: false },
      { name: "Business expense receipts", done: false },
    ]
  },
  {
    id: "5", client: "Jordan Lee", entity: "1040", sentDate: "Mar 1", status: "completed", docsReceived: 6, docsTotal: 6, reminder: 0,
    docs: [
      { name: "W-2 from employer", done: true },
      { name: "1099-NEC freelance", done: true },
      { name: "Bank statements", done: true },
      { name: "Prior year return", done: true },
      { name: "Home office documentation", done: true },
      { name: "Health insurance 1095-A", done: true },
    ]
  },
  {
    id: "6", client: "Aisha Patel", entity: "1120-S", sentDate: "Mar 2", status: "awaiting", docsReceived: 1, docsTotal: 8, reminder: 3,
    docs: [
      { name: "Prior year 1120-S return", done: true },
      { name: "Business bank statements", done: false },
      { name: "Payroll records", done: false },
      { name: "Inventory records", done: false },
      { name: "Business expense receipts", done: false },
      { name: "Equipment purchases", done: false },
      { name: "Shareholder distributions", done: false },
      { name: "Sales tax records", done: false },
    ]
  },
  {
    id: "7", client: "Tom Rivera", entity: "1065", sentDate: "—", status: "not-sent", docsReceived: 0, docsTotal: 9, reminder: 0,
    docs: [
      { name: "Partnership agreement", done: false },
      { name: "Partnership bank statements", done: false },
      { name: "Prior year 1065 return", done: false },
      { name: "Partner capital accounts", done: false },
      { name: "Rental income records", done: false },
      { name: "Property depreciation", done: false },
      { name: "Mortgage statements", done: false },
      { name: "Repairs and maintenance", done: false },
      { name: "Insurance records", done: false },
    ]
  },
  {
    id: "8", client: "Nina Zhao", entity: "1040", sentDate: "Mar 4", status: "in-progress", docsReceived: 3, docsTotal: 6, reminder: 1,
    docs: [
      { name: "W-2 from employer", done: true },
      { name: "1099-NEC freelance income", done: true },
      { name: "Prior year tax return", done: true },
      { name: "Bank statements", done: false },
      { name: "Business expense summary", done: false },
      { name: "Home office documentation", done: false },
    ]
  },
]

const statusConfig = {
  "completed": { label: "Completed", color: "bg-[#0f2820] text-[#34d399]" },
  "awaiting": { label: "Awaiting docs", color: "bg-[#2a1f0e] text-[#f59e0b]" },
  "in-progress": { label: "In progress", color: "bg-[#1a2d4a] text-[#4f8ef7]" },
  "not-sent": { label: "Not sent", color: "bg-[#1a1a1e] text-[#555]" },
}

export default function OrganizersPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const total = ORGANIZERS.length
  const completed = ORGANIZERS.filter(o => o.status === "completed").length
  const awaiting = ORGANIZERS.filter(o => o.status === "awaiting").length
  const notSent = ORGANIZERS.filter(o => o.status === "not-sent").length

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id)

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
          <Link href="/organizers" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] bg-[#1c2538] text-[#6a9fff]">Organizers</Link>
          <Link href="/invoices" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Invoices</Link>
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
          <div className="text-[15px] font-medium text-[#ddd]">Organizers</div>
          <button className="px-3.5 py-1.5 rounded-[7px] text-[13px] font-medium bg-[#4f8ef7] text-white hover:bg-[#5d99ff] transition-all">
            + Send Organizer
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-3.5 mb-7">
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Total sent</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#e8e8ea]">{total}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Completed</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#34d399]">{completed}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Awaiting docs</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#f59e0b]">{awaiting}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Not sent</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#555]">{notSent}</div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_100px_140px_120px_140px] px-5 py-3 border-b border-[#1a1a1e] text-[11px] text-[#444] uppercase tracking-widest">
              <div>Client</div>
              <div>Entity</div>
              <div>Sent</div>
              <div>Documents</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {ORGANIZERS.map((org) => {
              const status = statusConfig[org.status as keyof typeof statusConfig]
              const progress = org.docsTotal > 0 ? (org.docsReceived / org.docsTotal) * 100 : 0
              const initials = org.client.split(" ").map(n => n[0]).join("")
              const isExpanded = expanded === org.id

              return (
                <div key={org.id} className="border-b border-[#161618] last:border-0">
                  {/* Main row */}
                  <div
                    className="grid grid-cols-[1fr_80px_100px_140px_120px_140px] px-5 py-3.5 hover:bg-[#131315] transition-colors items-center cursor-pointer"
                    onClick={() => toggle(org.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-[7px] bg-[#1a2d4a] text-[#4f8ef7] flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-[13px] text-[#ccc]">{org.client}</div>
                        <div className={`text-[10px] transition-transform ${isExpanded ? "rotate-180" : ""} text-[#444]`}>▾</div>
                      </div>
                    </div>
                    <div className="text-[12px] text-[#555]">{org.entity}</div>
                    <div className="text-[12px] text-[#555]">{org.sentDate}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-[12px] text-[#ccc]">{org.docsReceived}/{org.docsTotal}</div>
                        <div className="flex-1 h-1.5 bg-[#1a1a1e] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: progress === 100 ? "#34d399" : progress > 40 ? "#4f8ef7" : "#f59e0b"
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className={`text-[10.5px] font-semibold font-mono px-2 py-0.5 rounded-[5px] ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      {org.status === "not-sent" && (
                        <button className="text-[11px] px-2.5 py-1 rounded-[5px] bg-[#1a2d4a] text-[#4f8ef7] hover:bg-[#1e3254] transition-all">
                          Send
                        </button>
                      )}
                      {(org.status === "awaiting" || org.status === "in-progress") && (
                        <button className="text-[11px] px-2.5 py-1 rounded-[5px] bg-[#2a1f0e] text-[#f59e0b] hover:bg-[#332510] transition-all">
                          Remind {org.reminder > 0 ? `(${org.reminder})` : ""}
                        </button>
                      )}
                      {org.status === "completed" && (
                        <button className="text-[11px] px-2.5 py-1 rounded-[5px] bg-[#0f2820] text-[#34d399] hover:bg-[#132e22] transition-all">
                          View
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable checklist */}
                  {isExpanded && (
                    <div className="px-5 pb-4 bg-[#0f0f11]">
                      <div className="border-t border-[#1a1a1e] pt-4">
                        <div className="text-[11px] text-[#444] uppercase tracking-widest mb-3">Document Checklist</div>
                        <div className="grid grid-cols-2 gap-2">
                          {org.docs.map((doc, i) => (
                            <div key={i} className="flex items-center gap-2.5 py-1.5">
                              <div className={`w-4 h-4 rounded-[4px] flex-shrink-0 flex items-center justify-center ${
                                doc.done ? "bg-[#0f2820] border border-[#34d399]/30" : "border border-[#333]"
                              }`}>
                                {doc.done && (
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 5L4 7L8 3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>
                              <span className={`text-[12px] ${doc.done ? "text-[#555] line-through" : "text-[#aaa]"}`}>
                                {doc.name}
                              </span>
                            </div>
                          ))}
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