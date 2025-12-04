"use client"

import React, { useState, useEffect } from "react"
import { Bell, Search, Settings, LogOut, User, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

export function DashboardNavbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme } = useTheme()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<{ name: string; image?: string; email?: string } | null>(null)
  const [mounted, setMounted] = useState(false)

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

  if (!mounted) return null

  return (
    <nav className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-14 px-6 gap-4">
        {/* Left Section - Search */}
        <div className="flex-1 max-w-md">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-border/60 transition-all ${
            searchOpen ? "bg-card border-primary/50" : "bg-muted/20 hover:bg-muted/40"
          }`}>
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setSearchOpen(false)}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-muted/40 rounded-lg transition text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-muted/40 rounded-lg transition text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-border/40 mx-1"></div>

          {/* Profile Dropdown - Desktop */}
          <div className="relative group hidden sm:block">
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/40 rounded-lg transition">
              {userProfile?.image ? (
                <img
                  src={userProfile.image}
                  alt={userProfile.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-xs font-semibold text-primary-foreground">
                  {userProfile?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium hidden md:inline">{userProfile?.name || "User"}</span>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-1 w-48 bg-card border border-border/60 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
              <div className="px-4 py-2 border-b border-border/40">
                <p className="text-xs font-semibold text-muted-foreground">Logged in as</p>
                <p className="text-sm font-medium text-foreground truncate">{userProfile?.name || "User"}</p>
                {userProfile?.email && (
                  <p className="text-xs text-muted-foreground truncate">{userProfile.email}</p>
                )}
              </div>
              <a href="/dashboard/profile" className="flex items-center gap-3 w-full px-4 py-2 text-sm text-foreground hover:bg-muted/40 transition">
                <User className="w-4 h-4" />
                View Profile
              </a>
              <a href="/dashboard/settings" className="flex items-center gap-3 w-full px-4 py-2 text-sm text-foreground hover:bg-muted/40 transition">
                <Settings className="w-4 h-4" />
                Settings
              </a>
              <div className="h-px bg-border/40 my-1"></div>
              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="p-2 sm:hidden hover:bg-muted/40 rounded-lg transition text-muted-foreground hover:text-foreground">
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-border/40 bg-card/50 px-4 py-3 space-y-2 text-sm">
          {userProfile && (
            <>
              <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-muted/40 rounded-lg">
                {userProfile?.image ? (
                  <img
                    src={userProfile.image}
                    alt={userProfile.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-xs font-semibold text-primary-foreground">
                    {userProfile?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{userProfile.name}</p>
                  {userProfile?.email && (
                    <p className="text-xs text-muted-foreground truncate">{userProfile.email}</p>
                  )}
                </div>
              </div>
              <div className="h-px bg-border/40 my-2"></div>
            </>
          )}
          <a href="/dashboard/profile" className="flex items-center gap-3 w-full px-3 py-2 text-foreground hover:bg-muted/40 rounded-lg transition">
            <User className="w-4 h-4" />
            Profile
          </a>
          <a href="/dashboard/settings" className="flex items-center gap-3 w-full px-3 py-2 text-foreground hover:bg-muted/40 rounded-lg transition">
            <Settings className="w-4 h-4" />
            Settings
          </a>
          <div className="h-px bg-border/40 my-2"></div>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
