"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { LayoutDashboard, BarChart3, Settings, User, LogOut, Menu, X, Moon, Sun, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [userProfile, setUserProfile] = useState<{ name: string; image: string } | null>(null)

  useEffect(() => {
    setMounted(true)
    const authData = localStorage.getItem("user_profile")
    if (authData) {
      const profile = JSON.parse(authData)
      setUserProfile(profile)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user_profile")
    setUserProfile(null)
    router.push("/auth/signin")
  }

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/data", label: "Data & Analytics", icon: BarChart3 },
    { href: "/dashboard/chatbot", label: "AI Assistant", icon: MessageCircle },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  if (!mounted) return null

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-card rounded-lg border border-border shadow-lg hover:shadow-xl transition-all"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static top-0 left-0 h-screen w-64 bg-card border-r border-border transition-transform lg:translate-x-0 z-40 flex flex-col
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Clean, minimal analytics upward trend */}
                <path d="M3 18v-2m4 2v-5m4 5v-8m4 8v-11m4 11v-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Zenith</h1>
              <p className="text-xs text-muted-foreground">Energy Operations</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="px-4 py-4">
          {userProfile ? (
            <div className="p-3 rounded-lg bg-muted border border-border">
              <div className="flex items-center gap-3">
                <img
                  src={userProfile.image || "/placeholder.svg?height=40&width=40&query=profile"}
                  alt={userProfile.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{userProfile.name}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-muted border border-border text-center">
              <p className="text-sm text-muted-foreground">Not signed in</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest mb-4 px-2">Menu</p>
          <nav className="space-y-1">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border space-y-1">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Dark Mode</span>
              </>
            )}
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {open && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}

