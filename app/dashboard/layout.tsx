import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-0">{children}</main>
      </div>
    </div>
  )
}
