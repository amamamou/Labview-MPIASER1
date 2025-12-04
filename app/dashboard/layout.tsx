"use client"
import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardNavbar } from "@/components/dashboard-navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      {/* FIXED SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT WITH NAVBAR */}
      <main className="flex-1 h-screen overflow-y-auto bg-background flex flex-col">
        {/* NAVBAR */}
        <DashboardNavbar />

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
