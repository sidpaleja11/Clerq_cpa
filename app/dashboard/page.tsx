"use client"

import Plan from "@/components/ui/agent-plan"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#0d0d0f] text-[#e8e8ea] font-sans overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-[220px] flex-shrink-0 bg-[#111113] border-r border-[#1e1e22] flex flex-col py-5">
        <div className="px-5 pb-6 border-b border-[#1e1e22] mb-4">
          <div className="text-[18px] font-semibold tracking-tight text-white">
            cler<span className="text-[#4f8ef7]">q</span>
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
          <NavItem label="Clients" href="/clients" badge="47" badgeColor="amber" />
          <NavItem label="Organizers" href="/organizers" badge="12" badgeColor="purple" />
          <NavItem label="Invoices" href="/invoices" badge="3" badgeColor="amber" />
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
            <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#4f8ef7] flex items-center justify-center text-[11px] font-semibold text-[#aac8ff]">
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
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[7px] text-[13px] font-medium bg-[#4f8ef7] text-white hover:bg-[#5d99ff] transition-all">
              + New Client
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          <div className="grid grid-cols-4 gap-3.5 mb-7">
            <StatCard label="Active Clients" value="47" delta="↑ 3 this month" deltaColor="green" />
            <StatCard label="Open Organizers" value="12" delta="4 awaiting docs" deltaColor="amber" />
            <StatCard label="Unpaid Invoices" value="$8.4k" delta="3 overdue" deltaColor="amber" />
            <StatCard label="Emails Drafted" value="31" delta="this week" deltaColor="neutral" />
          </div>

          <div className="grid grid-cols-[1fr_340px] gap-4">
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1e]">
                <div className="text-[13px] font-medium text-[#bbb]">Recent Activity</div>
                <Link href="/clients" className="text-[12px] text-[#4f8ef7] cursor-pointer hover:text-[#5d99ff]">View all</Link>
              </div>
              <ActivityItem dot="green" text={<><strong className="text-[#e8e8ea] font-medium">Sarah Chen</strong> completed organizer</>} time="2 min ago" />
              <ActivityItem dot="blue" text={<>AI drafted email to <strong className="text-[#e8e8ea] font-medium">Marcus Webb</strong> re: missing W-2</>} time="14 min ago" />
              <ActivityItem dot="amber" text={<><strong className="text-[#e8e8ea] font-medium">Invoice #1042</strong> overdue — $2,400</>} time="1 hr ago" />
              <ActivityItem dot="purple" text={<>Engagement letter signed by <strong className="text-[#e8e8ea] font-medium">Priya Nair</strong></>} time="3 hr ago" />
              <ActivityItem dot="red" text={<><strong className="text-[#e8e8ea] font-medium">David Kim</strong> — IRS notice received, deadline Apr 12</>} time="Yesterday" />
              <ActivityItem dot="green" text={<><strong className="text-[#e8e8ea] font-medium">Invoice #1038</strong> paid — $3,200</>} time="Yesterday" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1e]">
                  <div className="text-[13px] font-medium text-[#bbb]">Recent Clients</div>
                  <Link href="/clients" className="text-[12px] text-[#4f8ef7] cursor-pointer hover:text-[#5d99ff]">All clients</Link>
                </div>
                <ClientRow initials="SC" name="Sarah Chen" type="Freelancer · 1040" status="Active" statusColor="green" bg="blue" />
                <ClientRow initials="MW" name="Marcus Webb" type="S-Corp · 1120-S" status="Docs due" statusColor="amber" bg="amber" />
                <ClientRow initials="PN" name="Priya Nair" type="LLC · 1065" status="Review" statusColor="blue" bg="purple" />
                <ClientRow initials="DK" name="David Kim" type="Sole prop · 1040" status="IRS notice" statusColor="amber" bg="green" />
              </div>

              <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1e]">
                  <div className="text-[13px] font-medium text-[#bbb]">To-do</div>
                  <div className="text-[12px] text-[#4f8ef7] cursor-pointer">Add task</div>
                </div>
                <Plan />
              </div>
            </div>
          </div>
        </div>
      </div>
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
      active ? "bg-[#1c2538] text-[#6a9fff]" : "text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa]"
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
      <div className={`text-[11.5px] ${color}`}>{delta}</div>
    </div>
  )
}

function ActivityItem({ dot, text, time }: {
  dot: "green" | "blue" | "amber" | "purple" | "red"
  text: React.ReactNode
  time: string
}) {
  const dotColor = {
    green: "bg-[#34d399]", blue: "bg-[#4f8ef7]", amber: "bg-[#f59e0b]",
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
    blue: "bg-[#1a2d4a] text-[#4f8ef7]", amber: "bg-[#2a1f0e] text-[#f59e0b]",
    purple: "bg-[#1e1535] text-[#a78bfa]", green: "bg-[#0f2820] text-[#34d399]",
  }[bg]
  const pillColor = {
    green: "bg-[#0f2820] text-[#34d399]", amber: "bg-[#2a1f0e] text-[#f59e0b]",
    blue: "bg-[#1a2d4a] text-[#4f8ef7]",
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