"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Zap, Wind, Sun, Droplet, Shield, Gauge, CheckCircle2 } from "lucide-react"

export default function SignUp() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const userProfile = {
      name: formData.name || formData.email.split("@")[0],
      email: formData.email,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}&skinColor=f0d5a8`,
    }
    localStorage.setItem("user_profile", JSON.stringify(userProfile))

    setTimeout(() => {
      router.push("/dashboard")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left: Illustration & Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden items-center justify-center p-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float-reverse"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-primary/3 rounded-full blur-2xl animate-pulse-glow"></div>
        </div>

        <div className="relative z-10 max-w-sm">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="flex justify-center gap-4 mb-8">
              <div className="p-4 bg-white dark:bg-card rounded-xl shadow-lg animate-float hover:scale-110 transition-transform">
                <Sun className="w-8 h-8 text-primary" />
              </div>
              <div className="p-4 bg-white dark:bg-card rounded-xl shadow-lg animate-float-reverse hover:scale-110 transition-transform">
                <Wind className="w-8 h-8 text-accent" />
              </div>
              <div
                className="p-4 bg-white dark:bg-card rounded-xl shadow-lg animate-float hover:scale-110 transition-transform"
                style={{ animationDelay: "0.5s" }}
              >
                <Droplet className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-light mb-2">Join the Energy Revolution</h2>
            <p className="text-muted-foreground font-light">Start optimizing your renewable operations today</p>
          </div>

          <div className="space-y-4 animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
            {[
              { icon: Shield, label: "Enterprise Security", delay: "0.3s" },
              { icon: Zap, label: "Real-time Analytics", delay: "0.4s" },
              { icon: Gauge, label: "Global Coverage", delay: "0.5s" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: item.delay }}
              >
                <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-light">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 font-light text-lg mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-background font-bold group-hover:animate-spin-slow">
                ⚡
              </div>
              Quantum
            </Link>
            <h1 className="text-3xl font-light mb-2">Create Account</h1>
            <p className="text-muted-foreground text-sm font-light">Join leading companies managing renewable energy</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-light mb-2 text-foreground">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50 font-light"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-light mb-2 text-foreground">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your Company Name"
                required
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50 font-light"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-light mb-2 text-foreground">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                required
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50 font-light"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-light mb-2 text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50 font-light"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:scale-110 transition-all"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div
              className="space-y-2 text-sm text-muted-foreground animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Mixed case and numbers</span>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm font-light cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-border cursor-pointer accent-primary" required />
              <span className="group-hover:text-primary transition-colors">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-light hover:bg-primary/90 transition-all disabled:opacity-50 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin-slow"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground font-light">Or continue with</span>
            </div>
          </div>

          <button className="w-full mt-4 px-4 py-3 bg-card border border-border rounded-lg font-light hover:bg-muted transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6 font-light">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline font-light">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
