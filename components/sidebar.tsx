"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BarChart3, Settings, User, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/data", label: "Data & Analytics", icon: BarChart3 },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-20 left-4 z-30 p-2 bg-card rounded-lg border border-border"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static top-16 left-0 h-auto w-64 bg-sidebar border-r border-sidebar-border transition-transform lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-6 space-y-8">
          <div>
            <p className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wide mb-3">Menu</p>
            <nav className="space-y-2">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    pathname === href
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-sidebar-border pt-4">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {open && <div className="lg:hidden fixed inset-0 top-16 bg-black/50 z-20" onClick={() => setOpen(false)} />}
    </>
  )
}
