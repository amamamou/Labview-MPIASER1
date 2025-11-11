"use client"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, X, LogOut, User, LayoutDashboard, Zap, Bell } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image";

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userProfile, setUserProfile] = useState<{ name: string; image: string } | null>(null)

  useEffect(() => {
    setMounted(true)
    const authData = localStorage.getItem("user_profile")
    if (authData) {
      const profile = JSON.parse(authData)
      setIsAuthenticated(true)
      setUserProfile(profile)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user_profile")
    setIsAuthenticated(false)
    setUserProfile(null)
  }

  if (!mounted) return null

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-light hover:text-primary transition-colors">
              Home
            </Link>
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm font-light hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            )}
            <Link href="/about" className="text-sm font-light hover:text-primary transition-colors">
              About
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                className="p-2 rounded-lg hover:bg-muted transition-colors hover:scale-110"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-muted transition-colors hover:scale-110 hover:rotate-180 duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {isAuthenticated && userProfile ? (
              <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-border animate-slide-in-right">
                <div className="flex items-center gap-2 group">
                  <img
                    src={userProfile.image || "/placeholder.svg?height=32&width=32&query=profile"}
                    alt={userProfile.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30 group-hover:ring-primary transition-all group-hover:scale-105"
                  />
                  <span className="text-sm font-light">{userProfile.name}</span>
                </div>
                <Link
                  href="/profile"
                  className="p-1.5 rounded-lg hover:bg-muted hover:scale-110 transition-all"
                  aria-label="Profile"
                >
                  <User className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive hover:scale-110 transition-all"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-light rounded-lg hover:bg-muted transition-all hover:scale-105"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-light bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-sm hover:shadow-md flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5" /> Get Started
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors hover:scale-110"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-border animate-slide-down">
            <Link href="/" className="block px-4 py-2 text-sm font-light hover:bg-muted rounded-lg transition-colors">
              Home
            </Link>
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm font-light hover:bg-muted rounded-lg transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            )}
            <Link
              href="/about"
              className="block px-4 py-2 text-sm font-light hover:bg-muted rounded-lg transition-colors"
            >
              About
            </Link>
            <div className="pt-2 border-t border-border">
              {isAuthenticated && userProfile ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 mb-2">
                    <img
                      src={userProfile.image || "/placeholder.svg?height=28&width=28&query=profile"}
                      alt={userProfile.name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-primary/30"
                    />
                    <span className="text-sm font-light">{userProfile.name}</span>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm font-light hover:bg-muted rounded-lg transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm font-light text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="block px-4 py-2 text-sm font-light hover:bg-muted rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signin"
                    className="block px-4 py-2 text-sm font-light bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
