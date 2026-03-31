"use client"

import { useEffect, useState } from "react"
import Plan from "@/components/ui/agent-plan"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import NewClientModal from "@/components/ui/new-client-modal"

type Stats = {
  clientCount: number
  openOrganizers: number
  unpaidAmount: number
  emailsDrafted: number
}

type RecentClient = {
  id: string
  name: string
  entity_type: string | null
  service_level: string | null
}

type ActivityItem = {
  id: string
  client_name: string
  body: string | null
  ai_drafted: boolean
  sent_at: string
}

function displayEntityType(raw: string | null): string {
  const map: Record<string, string> = {
    '1040': '1040', '1120': '1120', '1120s': '1120-S', '1065': '1065', '1041': '1041',
  }
  return raw ? (map[raw.toLowerCase()] ?? raw) : '—'
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ clientCount: 0, openOrganizers: 0, unpaidAmount: 0, emailsDrafted: 0 })
  const [recentClients, setRecentClients] = useState<RecentClient[]>([])
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewClient, setShowNewClient] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

      const [
        { count: clientCount },
        { count: openOrganizers },
        { data: unpaidInvoices },
        { count: emailsDrafted },
        { data: clients },
        { data: comms },
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('organizers').select('*', { count: 'exact', head: true }).neq('status', 'completed'),
        supabase.from('invoices').select('amount').is('paid_at', null),
        supabase.from('communications').select('*', { count: 'exact', head: true }).eq('ai_drafted', true).gte('sent_at', weekAgo),
        supabase.from('clients').select('id, name, entity_type, service_level').order('created_at', { ascending: false }).limit(4),
        supabase.from('communications').select('id, body, ai_drafted, sent_at, clients(name)').order('sent_at', { ascending: false }).limit(6),
      ])

      const unpaidTotal = unpaidInvoices?.reduce((sum, inv) => sum + (inv.amount ?? 0), 0) ?? 0

      setStats({
        clientCount: clientCount ?? 0,
        openOrganizers: openOrganizers ?? 0,
        unpaidAmount: unpaidTotal,
        emailsDrafted: emailsDrafted ?? 0,
      })
      setRecentClients(clients ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setActivity((comms ?? []).map((c: any) => ({
        id: c.id,
        client_name: c.clients?.name ?? 'Unknown client',
        body: c.body,
        ai_drafted: c.ai_drafted,
        sent_at: c.sent_at,
      })))
      setLoading(false)
    }
    load()
  }, [])

  const formatMoney = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`

  return (
    <div className="flex h-screen bg-[#0d0d0f] text-[#e8e8ea] font-sans overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-[220px] flex-shrink-0 bg-[#111113] border-r border-[#1e1e22] flex flex-col py-5">
        <div className="px-5 pb-6 border-b border-[#1e1e22] mb-4">
          <div className="text-[18px] font-semibold tracking-tight text-white">
            cler<span className="text-[#FEED55]">q</span>
          </div>
          <div className="text-[11px] text-[#555] mt-0.5 tracking-widest font-mono">
            CPA WORKFLOW
          </div>
        </div>

        <div className="px-3 mb-2">
          <div className="text-[10px] font-medium text-[#444] tracking-widest uppercase px-2 mb-1">
            Workspace
          </div>
          <NavItem label="Dashboard" href="/dashboard" active badge={null} />
          <NavItem label="Clients" href="/clients" badge={!loading && stats.clientCount > 0 ? String(stats.clientCount) : null} badgeColor="amber" />
          <NavItem label="Organizers" href="/organizers" badge={!loading && stats.openOrganizers > 0 ? String(stats.openOrganizers) : null} badgeColor="purple" />
          <NavItem label="Invoices" href="/invoices" badge={null} />
        </div>

        <div className="px-3 mt-2 mb-2">
          <div className="text-[10px] font-medium text-[#444] tracking-widest uppercase px-2 mb-1">
            AI Tools
          </div>
          <NavItem label="Compose Email" href="/compose" badge={null} />
          <NavItem label="Engagements" href="/engagements" badge={null} />
        </div>

        <div className="px-3 mt-2">
          <div className="text-[10px] font-medium text-[#444] tracking-widest uppercase px-2 mb-1">
            Settings
          </div>
          <NavItem label="Compliance" href="/settings/compliance" badge={null} />
        </div>

        <div className="mt-auto px-5 pt-4 border-t border-[#1e1e22]">
          <div className="flex items-center gap-2.5">
            <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#262200] to-[#FEED55] flex items-center justify-center text-[11px] font-semibold text-[#fff8d0]">
              TR
            </div>
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
          <div className="text-[15px] font-medium text-[#ddd]">Dashboard</div>
          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[7px] text-[13px] font-medium text-[#666] border border-[#222] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">
              Search
            </button>
            <button
              onClick={() => setShowNewClient(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[7px] text-[13px] font-medium bg-[#FEED55] text-[#0d0d0f] hover:bg-[#ffe566] transition-all"
            >
              + New Client
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          <div className="grid grid-cols-4 gap-3.5 mb-7">
            <StatCard label="Active Clients" value={loading ? "—" : String(stats.clientCount)} delta="" deltaColor="neutral" />
            <StatCard label="Open Organizers" value={loading ? "—" : String(stats.openOrganizers)} delta={!loading && stats.openOrganizers > 0 ? "awaiting docs" : ""} deltaColor="amber" />
            <StatCard label="Unpaid Invoices" value={loading ? "—" : formatMoney(stats.unpaidAmount)} delta="" deltaColor="amber" />
            <StatCard label="Emails Drafted" value={loading ? "—" : String(stats.emailsDrafted)} delta="this week" deltaColor="neutral" />
          </div>

          <div className="grid grid-cols-[1fr_340px] gap-4">
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1e]">
                <div className="text-[13px] font-medium text-[#bbb]">Recent Activity</div>
                <Link href="/clients" className="text-[12px] text-[#FEED55] cursor-pointer hover:text-[#ffe566]">View all</Link>
              </div>
              {loading ? (
                <div className="px-5 py-8 text-center text-[12px] text-[#444]">Loading...</div>
              ) : activity.length === 0 ? (
                <div className="px-5 py-8 text-center text-[12px] text-[#444]">No recent activity. Activity will appear here as you use the platform.</div>
              ) : (
                activity.map(a => (
                  <ActivityFeedItem
                    key={a.id}
                    dot={a.ai_drafted ? "blue" : "green"}
                    text={
                      a.ai_drafted
                        ? <><strong className="text-[#e8e8ea] font-medium">{a.client_name}</strong> — AI drafted email</>
                        : <><strong className="text-[#e8e8ea] font-medium">{a.client_name}</strong> — {a.body?.slice(0, 50)}{(a.body?.length ?? 0) > 50 ? '…' : ''}</>
                    }
                    time={formatTime(a.sent_at)}
                  />
                ))
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1e]">
                  <div className="text-[13px] font-medium text-[#bbb]">Recent Clients</div>
                  <Link href="/clients" className="text-[12px] text-[#FEED55] cursor-pointer hover:text-[#ffe566]">All clients</Link>
                </div>
                {loading ? (
                  <div className="px-5 py-6 text-center text-[12px] text-[#444]">Loading...</div>
                ) : recentClients.length === 0 ? (
                  <div className="px-5 py-6 text-center text-[12px] text-[#444]">No clients yet.</div>
                ) : (
                  recentClients.map(c => (
                    <ClientRow
                      key={c.id}
                      initials={c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      name={c.name}
                      type={`${c.service_level ?? '—'} · ${displayEntityType(c.entity_type)}`}
                      status="Active"
                      statusColor="green"
                      bg="blue"
                    />
                  ))
                )}
              </div>

              <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1e]">
                  <div className="text-[13px] font-medium text-[#bbb]">To-do</div>
                  <div className="text-[12px] text-[#FEED55] cursor-pointer">Add task</div>
                </div>
                <Plan />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showNewClient && (
        <NewClientModal
          onClose={() => setShowNewClient(false)}
          onSuccess={() => setShowNewClient(false)}
        />
      )}
    </div>
  )
}

function NavItem({ label, href, active, badge, badgeColor }: {
  label: string
  href: string
  active?: boolean
  badge: string | null
  badgeColor?: "amber" | "purple"
}) {
  return (
    <Link href={href} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] transition-all ${
      active ? "bg-[#1f1d00] text-[#ffe566]" : "text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa]"
    }`}>
      {label}
      {badge && (
        <span className={`ml-auto text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded-[5px] ${
          badgeColor === "amber" ? "bg-[#2a1f0e] text-[#f59e0b]" : "bg-[#2a1e3d] text-[#8b5cf6]"
        }`}>
          {badge}
        </span>
      )}
    </Link>
  )
}

function StatCard({ label, value, delta, deltaColor }: {
  label: string
  value: string
  delta: string
  deltaColor: "green" | "amber" | "neutral"
}) {
  const color = { green: "text-[#34d399]", amber: "text-[#f59e0b]", neutral: "text-[#555]" }[deltaColor]
  return (
    <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5 hover:border-[#2a2a30] hover:bg-[#141416] transition-all cursor-pointer">
      <div className="text-[12px] text-[#555] mb-2.5">{label}</div>
      <div className="text-[26px] font-semibold font-mono tracking-tight text-[#e8e8ea] leading-none mb-2">{value}</div>
      {delta && <div className={`text-[11.5px] ${color}`}>{delta}</div>}
    </div>
  )
}

function ActivityFeedItem({ dot, text, time }: {
  dot: "green" | "blue" | "amber" | "purple" | "red"
  text: React.ReactNode
  time: string
}) {
  const dotColor = {
    green: "bg-[#34d399]", blue: "bg-[#FEED55]", amber: "bg-[#f59e0b]",
    purple: "bg-[#a78bfa]", red: "bg-[#f87171]",
  }[dot]
  return (
    <div className="flex items-start gap-3 px-5 py-3.5 border-b border-[#161618] last:border-0 hover:bg-[#131315] cursor-pointer transition-all">
      <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${dotColor}`} />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-[#ccc] leading-snug">{text}</div>
        <div className="text-[11px] text-[#444] mt-0.5 font-mono">{time}</div>
      </div>
    </div>
  )
}

function ClientRow({ initials, name, type, status, statusColor, bg }: {
  initials: string
  name: string
  type: string
  status: string
  statusColor: "green" | "amber" | "blue"
  bg: "blue" | "amber" | "purple" | "green"
}) {
  const bgColor = {
    blue: "bg-[#262200] text-[#FEED55]", amber: "bg-[#2a1f0e] text-[#f59e0b]",
    purple: "bg-[#1e1535] text-[#a78bfa]", green: "bg-[#0f2820] text-[#34d399]",
  }[bg]
  const pillColor = {
    green: "bg-[#0f2820] text-[#34d399]", amber: "bg-[#2a1f0e] text-[#f59e0b]",
    blue: "bg-[#262200] text-[#FEED55]",
  }[statusColor]
  return (
    <Link href="/clients" className="flex items-center gap-3 px-5 py-[11px] border-b border-[#161618] last:border-0 hover:bg-[#131315] cursor-pointer transition-all">
      <div className={`w-7 h-7 rounded-[7px] flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${bgColor}`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-[#ccc]">{name}</div>
        <div className="text-[11px] text-[#444] mt-px">{type}</div>
      </div>
      <span className={`text-[10.5px] font-semibold font-mono px-2 py-0.5 rounded-[5px] ${pillColor}`}>
        {status}
      </span>
    </Link>
  )
}
