"use client"

import Link from "next/link"
import { useState } from "react"
import { PromptInputBox } from "@/components/ui/ai-prompt-box"
import { SpecialText } from "@/components/ui/special-text"
import { FloatingPaths } from "@/components/ui/background-paths"

const DEMO_RESPONSE = `Hi Sarah,

I hope this message finds you well. As we head into tax season, I wanted to reach out to get the process started for your 2025 return.

To prepare your 1040, I'll need the following documents:
- W-2 from your employer
- Any 1099 forms (freelance income, interest, dividends)
- Bank statements for business accounts
- Prior year return (if you're a new client)

Please upload these to your secure client portal at your earliest convenience. If you have any questions about what's needed, don't hesitate to reach out.

Best,
[Your Name], CPA`

const FEATURES = [
  { title: "AI Email Hub", desc: "Draft every client email in your voice. SSTS 7 logged automatically.", color: "text-[#FEED55]" },
  { title: "Document Collection", desc: "Auto-generate organizers, track missing docs.", color: "text-[#34d399]" },
  { title: "Engagement Letters", desc: "AICPA templates, e-signature built in. 60 seconds per client.", color: "text-[#a78bfa]" },
  { title: "Client Onboarding", desc: "Intake → 7216 consent → organizer. Fully automated.", color: "text-[#f59e0b]" },
  { title: "Invoicing & Payments", desc: "Automated reminders at 7, 14, 30, 60 days. Stripe Connect.", color: "text-[#f87171]" },
  { title: "Compliance Built In", desc: "WISP, FTC Safeguards checklist, breach notification workflow.", color: "text-[#FEED55]" },
  { title: "IRS Notice Tracker", desc: "Identifies notices, sets deadlines, drafts response letters.", color: "text-[#34d399]" },
  { title: "Client Portal", desc: "Secure upload, preview, and acknowledgment. Consumer-grade simple.", color: "text-[#a78bfa]" },
]

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [demo, setDemo] = useState("")

  const handleSend = async (message: string) => {
    setLoading(true)
    setResponse("")
    setDemo(message)
    await new Promise(r => setTimeout(r, 1800))
    setResponse(DEMO_RESPONSE)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-[#e8e8ea] font-sans flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[#1e1e22]">
        <div className="text-[20px] font-semibold tracking-tight text-white">
          cler<span className="text-[#FEED55]">q</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-[13px] text-[#666] hover:text-[#aaa] transition-all px-3 py-1.5">
            Sign in
          </Link>
          <Link href="/dashboard" className="text-[13px] font-medium bg-[#FEED55] text-[#0d0d0f] px-4 py-1.5 rounded-[7px] hover:bg-[#ffe566] transition-all">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative flex flex-col items-center px-8 py-24 text-center overflow-hidden">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
        <div className="relative z-10 flex flex-col items-center w-full">
        <div className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#262200] text-[#FEED55] mb-8 tracking-widest uppercase">
          AI-Powered CPA Workflow
        </div>

        <h1 className="text-[52px] font-semibold tracking-tight text-white leading-tight max-w-3xl mb-6">
          Everything around the accounting,{" "}
          <SpecialText className="text-[52px] font-semibold tracking-tight text-[#FEED55] leading-tight">handled.</SpecialText>
        </h1>

        <p className="text-[17px] text-[#555] max-w-xl leading-relaxed mb-10">
          Clerq automates client emails, document collection, engagement letters, and invoicing — so solo CPAs can focus on the actual accounting.
        </p>

        {/* AI Demo Box */}
        <div className="w-full max-w-2xl mb-4">
          <PromptInputBox
            isLoading={loading}
            placeholder="Try it — e.g. 'Draft a document request email for a freelancer client...'"
            onSend={handleSend}
          />
        </div>

        {/* Suggested prompts */}
        {!response && !loading && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[
              "Draft a tax season kickoff email",
              "Write a fee reminder for an overdue invoice",
              "Send a document request to a new client",
              "Draft a return delivery email",
            ].map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="text-[12px] px-3 py-1.5 rounded-full border border-[#1e1e22] text-[#555] bg-[#111113] hover:border-[#2a2a30] hover:text-[#aaa] transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Demo response */}
        {(loading || response) && (
          <div className="w-full max-w-2xl mb-12">
            <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden text-left">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#1a1a1e]">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-[4px] bg-[#2a1f0e] text-[#f59e0b]">
                  AI Draft — Review before sending
                </span>
                {demo && <span className="text-[12px] text-[#555] truncate">"{demo}"</span>}
              </div>
              {loading ? (
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-[#1a1a1e] rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-[#1a1a1e] rounded animate-pulse w-full" />
                  <div className="h-3 bg-[#1a1a1e] rounded animate-pulse w-5/6" />
                  <div className="h-3 bg-[#1a1a1e] rounded animate-pulse w-2/3" />
                  <div className="h-3 bg-[#1a1a1e] rounded animate-pulse w-full" />
                </div>
              ) : (
                <div className="p-5">
                  <pre className="text-[13px] text-[#ccc] leading-relaxed whitespace-pre-wrap font-sans">{response}</pre>
                  <div className="mt-4 pt-4 border-t border-[#1a1a1e] flex items-center gap-3">
                    <Link href="/dashboard" className="px-4 py-2 rounded-[7px] text-[13px] font-medium bg-[#FEED55] text-[#0d0d0f] hover:bg-[#ffe566] transition-all">
                      Use this in Clerq →
                    </Link>
                    <span className="text-[12px] text-[#444]">Sign up to send, log, and track all client emails</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-12 mb-16">
          {[
            { value: "33,850", label: "Solo CPA firms in the US" },
            { value: "40–70%", label: "Of time spent on admin" },
            { value: "$2.4B", label: "Annual revenue, no AI tools" },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-[32px] font-semibold font-mono text-white mb-1">{stat.value}</div>
              <div className="text-[13px] text-[#444]">{stat.label}</div>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Scrolling marquee */}
      <div className="w-full overflow-hidden mb-16 py-2 relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0d0d0f] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0d0d0f] to-transparent z-10 pointer-events-none" />
        <div
          className="flex gap-4 w-max"
          style={{
            animation: "marquee 30s linear infinite",
          }}
        >
          {[...FEATURES, ...FEATURES].map((card, i) => (
            <div
              key={i}
              className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5 w-[260px] flex-shrink-0 hover:border-[#2a2a30] transition-all"
            >
              <div className={`text-[13px] font-medium mb-2 ${card.color}`}>{card.title}</div>
              <div className="text-[12px] text-[#555] leading-relaxed">{card.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* CTA */}
      <div className="flex justify-center px-8 pb-24">
        <div className="bg-[#111113] border border-[#1e1e22] rounded-[14px] p-10 max-w-2xl w-full text-center">
          <div className="text-[24px] font-semibold text-white mb-3">Built for solo CPAs</div>
          <div className="text-[14px] text-[#555] mb-6 leading-relaxed">
            Setup in under 30 minutes. No IT department required. Cancel anytime.
          </div>
          <Link href="/dashboard" className="px-6 py-3 rounded-[8px] text-[14px] font-medium bg-[#FEED55] text-[#0d0d0f] hover:bg-[#ffe566] transition-all inline-block">
            Start free — $49/mo after trial
          </Link>
          <div className="text-[11px] text-[#333] mt-4">No credit card required for trial</div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1e1e22] px-8 py-5 flex items-center justify-between">
        <div className="text-[13px] font-semibold text-white">
          cler<span className="text-[#FEED55]">q</span>
        </div>
        <div className="text-[12px] text-[#333]">© 2026 Clerq. Built for solo CPAs.</div>
        <div className="flex items-center gap-4 text-[12px] text-[#444]">
          <span className="hover:text-[#aaa] cursor-pointer transition-all">Privacy</span>
          <span className="hover:text-[#aaa] cursor-pointer transition-all">Terms</span>
          <span className="hover:text-[#aaa] cursor-pointer transition-all">Security</span>
        </div>
      </footer>
    </div>
  )
}