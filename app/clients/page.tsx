"use client"

import { useState } from "react"
import MemberList from "@/components/ui/member-list"
import NewClientModal from "@/components/ui/new-client-modal"
import Link from "next/link"

export default function ClientsPage() {
  const [showModal, setShowModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <div className="flex h-screen bg-[#0d0d0f] text-[#e8e8ea] font-sans overflow-hidden">
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
          <Link href="/clients" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] bg-[#1f1d00] text-[#ffe566]">Clients</Link>
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-7 py-[18px] border-b border-[#1a1a1e] bg-[#0d0d0f]">
          <div className="text-[15px] font-medium text-[#ddd]">Clients</div>
          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-1.5 rounded-[7px] text-[13px] font-medium bg-[#FEED55] text-[#0d0d0f] hover:bg-[#ffe566] transition-all"
          >
            + New Client
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <MemberList key={refreshKey} />
        </div>
      </div>

      {showModal && (
        <NewClientModal
          onClose={() => setShowModal(false)}
          onSuccess={() => setRefreshKey(k => k + 1)}
        />
      )}
    </div>
  )
}