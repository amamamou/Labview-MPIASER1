"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function Blog() {
  const posts = [
    {
      title: "Optimizing Solar Farm Output with Predictive Analytics",
      excerpt: "Learn how predictive models can improve energy yield and reduce downtime.",
      href: "/blog/solar-predictive-analytics",
      image: "https://source.unsplash.com/1400x800/?solar,solar-panel",
    },
    {
      title: "Wind Turbine Maintenance Best Practices",
      excerpt: "A practical guide to scheduling maintenance for maximum uptime.",
      href: "/blog/wind-maintenance",
      image: "https://source.unsplash.com/1400x800/?wind,turbine",
    },
    {
      title: "Integrating Battery Storage for Grid Stability",
      excerpt: "How storage helps balance intermittent renewable supply.",
      href: "/blog/battery-storage",
      image: "https://source.unsplash.com/1400x800/?battery,energy-storage",
    },
    {
      title: "AI for Predictive Maintenance in Energy",
      excerpt: "Applying machine learning to detect faults before they cause downtime.",
      href: "/blog/ai-predictive-maintenance",
      image: "https://source.unsplash.com/1400x800/?machine-learning,ai",
    },
    {
      title: "Smart Grid: The Future of Energy Distribution",
      excerpt: "How the smart grid enables two-way power flows and better resilience.",
      href: "/blog/smart-grid",
      image: "https://source.unsplash.com/1400x800/?smart-grid,grid",
    },
    {
      title: "Drones & Remote Inspection for Wind Farms",
      excerpt: "Faster inspections with lower risk — how drones change maintenance.",
      href: "/blog/drones-inspection",
      image: "https://source.unsplash.com/1400x800/?drone,inspection,wind-turbine",
    },
    {
      title: "Satellite Data & Remote Sensing for Resource Assessment",
      excerpt: "Using satellite imagery to optimize site selection and performance.",
      href: "/blog/satellite-remote-sensing",
      image: "https://source.unsplash.com/1400x800/?satellite,remote-sensing",
    },
    {
      title: "Hydropower Modernization: Balancing Ecology and Output",
      excerpt: "Upgrades and control strategies for modern hydro plants.",
      href: "/blog/hydropower-modernization",
      image: "https://source.unsplash.com/1400x800/?hydro,hydropower",
    },
    {
      title: "AI-Driven Forecasting for Renewable Integration",
      excerpt: "Short-term and long-term forecasting techniques driven by AI.",
      href: "/blog/ai-forecasting",
      image: "https://source.unsplash.com/1400x800/?forecasting,ai,energy",
    },
    {
      title: "EV Charging & Grid Impact: Planning for Growth",
      excerpt: "Strategies to integrate growing EV loads while keeping the grid stable.",
      href: "/blog/ev-charging-grid",
      image: "https://source.unsplash.com/1400x800/?electric-vehicle,charging,grid",
    },
    {
      title: "Microgrids and Resilience for Remote Sites",
      excerpt: "Designing microgrids that combine renewables, storage, and controls.",
      href: "/blog/microgrids-resilience",
      image: "https://source.unsplash.com/1400x800/?microgrid,solar,storage",
    },
    {
      title: "Data Pipelines: From SCADA to AI Models",
      excerpt: "Best practices for reliable, low-latency telemetry pipelines.",
      href: "/blog/data-pipelines-scada-ai",
      image: "https://source.unsplash.com/1400x800/?data,analytics,server-room",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-24 md:py-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-light leading-tight mb-4 text-foreground">Blog</h1>
            <p className="text-xl font-light text-muted-foreground mb-8">Insights, guides and updates from the Labview team.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <article key={i} className="flex flex-col bg-transparent rounded-md overflow-hidden hover:shadow-lg transition-shadow">
                {post.image && (
                  <div className="w-full h-48 bg-muted overflow-hidden relative">
                    <Image src={post.image} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{post.excerpt}</p>
                  <div className="mt-auto">
                    <Link href={post.href} className="text-primary hover:underline inline-flex items-center gap-2">
                      Read more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
