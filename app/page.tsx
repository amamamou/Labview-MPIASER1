"use client"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  ArrowRight,
  Zap,
  BarChart3,
  Shield,
  Leaf,
  Gauge,
  Smartphone,
  Clock,
  Sun,
  Wind,
  Droplet,
  TrendingUp,
  Sparkles,
  Lightbulb,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Enhanced with more animations */}
      <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float-reverse"></div>
          <div
            className="absolute top-1/3 left-1/2 w-80 h-80 bg-primary/4 rounded-full blur-2xl animate-pulse-glow"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-accent/4 rounded-full blur-2xl animate-pulse-glow"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <div
              className="inline-block mb-6 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm hover:scale-105 transition-transform animate-float"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="text-xs font-light text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Next Generation Energy Platform
              </span>
            </div>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-8 text-balance text-foreground animate-fade-in-up"
              style={{ animationDelay: "0.15s" }}
            >
              Intelligent Energy,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-pulse-glow">
                Smarter Future
              </span>
            </h1>
            <p
              className="text-lg md:text-xl font-light text-muted-foreground mb-12 max-w-3xl mx-auto text-balance leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Real-time monitoring and analytics for wind, solar, and hydro. Transform your renewable energy operations
              with AI-powered insights and enterprise-grade performance.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce-gentle"
              style={{ animationDelay: "0.3s" }}
            >
              <Link
                href="/auth/signin"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-light flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 group"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 border border-border text-foreground rounded-lg font-light hover:bg-muted transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
              >
                <Lightbulb className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Explore Features
              </Link>
            </div>
          </div>

          {/* Dashboard Preview with Icons */}
          <div className="mt-24 relative group animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl blur-3xl group-hover:blur-2xl transition-all duration-500 -z-10"></div>
            <div className="bg-white/50 dark:bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-8 md:p-12 shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: Sun, label: "Solar", value: "2,458 kW", change: "+12%", color: "#fbbf24" },
                  { icon: Wind, label: "Wind", value: "1,890 kW", change: "+8%", color: "#3b82f6" },
                  { icon: Droplet, label: "Hydro", value: "3,124 kW", change: "+5%", color: "#06b6d4" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white dark:bg-background rounded-xl border border-border/50 hover:border-primary/50 transition-all hover:scale-105 animate-fade-in-up group hover:shadow-lg"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all group-hover:scale-110">
                        <item.icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <span className="text-xs font-light text-primary flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {item.change}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-lg font-light text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  { label: "Peak Output", val: 85 },
                  { label: "Efficiency Rate", val: 72 },
                  { label: "System Health", val: 68 },
                ].map((bar, i) => (
                  <div key={i} className="space-y-1 animate-fade-in-up" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                    <div className="flex justify-between text-xs">
                      <span className="font-light text-muted-foreground">{bar.label}</span>
                      <span className="font-light text-foreground">{bar.val}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent animate-pulse-glow"
                        style={{ width: `${bar.val}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Enhanced Visuals */}
      <section id="features" className="py-32 md:py-48 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-light leading-tight mb-6 text-foreground">
              Enterprise-Grade Capabilities
            </h2>
            <p className="text-lg font-light text-muted-foreground max-w-2xl mx-auto">
              Everything you need for professional energy management at scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BarChart3, title: "Live Analytics", desc: "Real-time dashboards with instant insights" },
              { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption and compliance" },
              { icon: Smartphone, title: "Mobile App", desc: "Monitor on the go with native apps" },
              { icon: Clock, title: "24/7 Support", desc: "Dedicated support team always ready" },
              { icon: Gauge, title: "Predictive AI", desc: "ML-powered forecasting and alerts" },
              { icon: Zap, title: "Fast Integration", desc: "Connect in minutes, not months" },
              { icon: Leaf, title: "Carbon Tracking", desc: "ESG metrics and sustainability goals" },
              { icon: TrendingUp, title: "Custom Reports", desc: "Export and share intelligent reports" },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 bg-white dark:bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 animate-fade-in-up hover:bg-primary/5 dark:hover:bg-primary/10"
                style={{ animationDelay: `${(i % 4) * 0.1}s` }}
              >
                <div className="p-3 bg-primary/10 w-fit rounded-lg group-hover:bg-primary/20 group-hover:scale-110 transition-all mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-light text-lg mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm font-light text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-32 md:py-48 bg-gradient-to-br from-primary/8 via-background to-accent/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "2.5K+", label: "Active Companies", icon: "🏢" },
              { number: "1.2M+", label: "Data Points Daily", icon: "📊" },
              { number: "99.9%", label: "Uptime SLA", icon: "⚡" },
              { number: "150+", label: "Countries", icon: "🌍" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-xl bg-white dark:bg-card border border-border/50 hover:border-primary/50 transition-all hover:scale-105 hover:shadow-lg animate-fade-in-up hover:bg-primary/5 dark:hover:bg-primary/10"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="text-4xl mb-2 animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-light text-primary mb-2">{stat.number}</div>
                <p className="text-sm font-light text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-48">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-light leading-tight mb-8 text-foreground">
              Ready to Power Your Future?
            </h2>
            <p className="text-lg font-light text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join global energy leaders optimizing operations with Quantum. Start your free trial today and see results
              immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signin"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-light hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2 hover:scale-105 active:scale-95 group"
              >
                Begin Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 border border-border rounded-lg font-light hover:bg-muted transition-all inline-flex items-center justify-center hover:scale-105 active:scale-95 group"
              >
                <BarChart3 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                View Demo Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
