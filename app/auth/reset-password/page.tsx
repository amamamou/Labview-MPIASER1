"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import Image from "next/image";

export default function ResetPassword() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
         {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-light text-lg text-foreground hover:text-primary transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="group-hover:scale-110 transition-transform"
              />
            </div>

            <span className="hidden sm:inline">Quantum</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-muted-foreground">Enter your email to receive password reset instructions</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="p-6 bg-card rounded-lg border border-border text-center">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-semibold text-lg mb-2">Check Your Email</h2>
            <p className="text-muted-foreground text-sm mb-6">We've sent password reset instructions to {email}</p>
            <p className="text-sm text-muted-foreground mb-4">
              Didn't receive the email? Check your spam folder or try another address.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="w-full px-4 py-3 bg-input border border-border rounded-lg font-medium hover:bg-muted transition"
            >
              Try Another Email
            </button>
          </div>
        )}

        <Link
          href="/auth/signin"
          className="flex items-center justify-center gap-2 text-primary hover:underline mt-6 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}
