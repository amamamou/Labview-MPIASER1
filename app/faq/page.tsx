"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const faqs = [
  {
    q: "How does Labview collect data from my installations?",
    a: "We connect to on-site telemetry and SCADA systems via secure APIs and ingest telemetry into our analytics platform in real-time.",
  },
  {
    q: "Is my data private and secure?",
    a: "Yes — we follow industry best practices for encryption and access control. Enterprise plans include advanced compliance features.",
  },
  {
    q: "Can I export my energy data?",
    a: "Yes — you can export data from the dashboard in CSV format or connect via our API for automated exports.",
  },
  {
    q: "Do you provide integration with third-party SCADA systems?",
    a: "Yes — our platform supports common industrial protocols and can integrate with most SCADA vendors via connectors or APIs.",
  },
  {
    q: "Does Labview support multi-site organizations?",
    a: "Absolutely — you can manage multiple installations, teams, and permissions from a centralized organization dashboard.",
  },
  {
    q: "Can I get alerts on mobile?",
    a: "Yes — configure alert channels including email, SMS (enterprise), and in-app notifications to stay informed.",
  },
]

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-24 md:py-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-light leading-tight mb-4 text-foreground">Frequently asked questions</h1>
            <p className="text-xl font-light text-muted-foreground mb-8">Answers to common questions about Labview and the platform.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((item, i) => (
              <details
                key={i}
                className="p-4 bg-card rounded-2xl border border-border"
              >
                <summary className="list-none cursor-pointer flex items-center justify-between gap-3">
                  <span className="text-lg font-medium">{item.q}</span>
                  <span className="text-muted-foreground">+</span>
                </summary>
                <div className="mt-3 text-muted-foreground">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
