"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

type Organizer = {
  id: string
  client_name: string
  entity_type: string
  status: string
  sent_at: string | null
  completed_at: string | null
  reminder_count: number
  year: number | null
}

const statusConfig: Record<string, { label: string; color: string }> = {
  "completed": { label: "Completed", color: "bg-[#0f2820] text-[#34d399]" },
  "awaiting": { label: "Awaiting docs", color: "bg-[#2a1f0e] text-[#f59e0b]" },
  "pending": { label: "Awaiting docs", color: "bg-[#2a1f0e] text-[#f59e0b]" },
  "in-progress": { label: "In progress", color: "bg-[#1a2d4a] text-[#4f8ef7]" },
  "not-sent": { label: "Not sent", color: "bg-[#1a1a1e] text-[#555]" },
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

export default function OrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('organizers')
      .select('id, year, status, sent_at, completed_at, reminder_count, created_at, clients(name, entity_type)')
      .order('created_at', { ascending: false })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }) => {
        if (data) {
          setOrganizers(data.map((o: any) => ({
            id: o.id,
            client_name: o.clients?.name ?? 'Unknown',
            entity_type: displayEntityType(o.clients?.entity_type),
            status: o.status ?? 'pending',
            sent_at: o.sent_at,
            completed_at: o.completed_at,
            reminder_count: o.reminder_count ?? 0,
            year: o.year,
          })))
        }
        setLoading(false)
      })
  }, [])

  const total = organizers.filter(o => o.sent_at).length
  const completed = organizers.filter(o => o.status === "completed").length
  const awaiting = organizers.filter(o => o.status === "awaiting" || o.status === "pending").length
  const notSent = organizers.filter(o => !o.sent_at || o.status === "not-sent").length

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
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#e8e8ea]">{loading ? "—" : total}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Completed</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#34d399]">{loading ? "—" : completed}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Awaiting docs</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#f59e0b]">{loading ? "—" : awaiting}</div>
            </div>
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
              <div className="text-[12px] text-[#555] mb-2">Not sent</div>
              <div className="text-[26px] font-semibold font-mono tracking-tight text-[#555]">{loading ? "—" : notSent}</div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_80px_100px_120px_140px] px-5 py-3 border-b border-[#1a1a1e] text-[11px] text-[#444] uppercase tracking-widest">
              <div>Client</div>
              <div>Entity</div>
              <div>Year</div>
              <div>Sent</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {loading ? (
              <div className="px-5 py-10 text-center text-[12px] text-[#444]">Loading organizers...</div>
            ) : organizers.length === 0 ? (
              <div className="px-5 py-10 text-center text-[12px] text-[#444]">No organizers yet. Send your first organizer to get started.</div>
            ) : (
              organizers.map((org) => {
                const statusCfg = statusConfig[org.status] ?? statusConfig["pending"]
                const initials = org.client_name.split(" ").map(n => n[0]).join("").slice(0, 2)

                return (
                  <div key={org.id} className="grid grid-cols-[1fr_80px_80px_100px_120px_140px] px-5 py-3.5 border-b border-[#161618] last:border-0 hover:bg-[#131315] transition-colors items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-[7px] bg-[#1a2d4a] text-[#4f8ef7] flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="text-[13px] text-[#ccc]">{org.client_name}</div>
                    </div>
                    <div className="text-[12px] text-[#555]">{org.entity_type}</div>
                    <div className="text-[12px] text-[#555]">{org.year ?? "—"}</div>
                    <div className="text-[12px] text-[#555]">{formatDate(org.sent_at)}</div>
                    <div>
                      <span className={`text-[10.5px] font-semibold font-mono px-2 py-0.5 rounded-[5px] ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!org.sent_at && (
                        <button className="text-[11px] px-2.5 py-1 rounded-[5px] bg-[#1a2d4a] text-[#4f8ef7] hover:bg-[#1e3254] transition-all">
                          Send
                        </button>
                      )}
                      {org.sent_at && org.status !== "completed" && (
                        <button className="text-[11px] px-2.5 py-1 rounded-[5px] bg-[#2a1f0e] text-[#f59e0b] hover:bg-[#332510] transition-all">
                          Remind {org.reminder_count > 0 ? `(${org.reminder_count})` : ""}
                        </button>
                      )}
                      {org.status === "completed" && (
                        <button className="text-[11px] px-2.5 py-1 rounded-[5px] bg-[#0f2820] text-[#34d399] hover:bg-[#132e22] transition-all">
                          View
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
    </div>
  )
}
