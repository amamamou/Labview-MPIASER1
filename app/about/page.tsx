"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-24 md:py-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-light leading-tight mb-6 text-foreground">About Labview</h1>
            <p className="text-xl font-light text-muted-foreground mb-8">
              Pioneering renewable energy intelligence for a sustainable future.
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-light mb-4">Our Mission</h2>
              <p className="text-muted-foreground font-light leading-relaxed">
                We believe renewable energy should be accessible, efficient, and transparent. Labview empowers
                organizations to monitor, analyze, and optimize their renewable energy resources with confidence and
                precision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light mb-4">What We Do</h2>
              <p className="text-muted-foreground font-light leading-relaxed mb-4">
                Labview provides real-time analytics and monitoring for solar, wind, and hydro energy systems. Our
                platform combines cutting-edge technology with intuitive design to make energy management simple and
                effective.
              </p>
              <p className="text-muted-foreground font-light leading-relaxed">
                Whether you're managing a single installation or a portfolio of facilities, our tools help you make
                data-driven decisions that maximize efficiency and environmental impact.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light mb-4">Why Choose Us</h2>
              <ul className="space-y-3">
                {[
                  "Real-time monitoring with 99% uptime guarantee",
                  "Advanced analytics powered by machine learning",
                  "Seamless team collaboration tools",
                  "Enterprise-grade security and compliance",
                  "24/7 professional support",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-16 pt-16 border-t border-border text-center">
            <p className="text-muted-foreground font-light mb-6">Ready to optimize your renewable energy?</p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded font-normal hover:bg-primary/90 transition duration-200"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
