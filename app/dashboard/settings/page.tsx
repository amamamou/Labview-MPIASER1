"use client"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor, Bell, Lock, Database } from "lucide-react"
import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
export default function Settings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your experience and preferences</p>
      </div>

      <div className="max-w-6xl space-y-6">
        {/* Theme Settings */}
        <div className="p-6 bg-card rounded-2xl border border-border">
          <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Sun className="w-5 h-5" />
            Appearance
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-3">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Monitor },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTheme(id)}
                    className={`p-3 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                      theme === id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 bg-card rounded-2xl border border-border">
          <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          <div className="space-y-4">
            {[
              { label: "Energy alerts", desc: "Receive alerts when production drops below threshold" },
              { label: "System maintenance", desc: "Notifications about scheduled maintenance" },
              { label: "Weekly reports", desc: "Get weekly energy reports" },
              { label: "Team updates", desc: "Updates when team members join or change settings" },
            ].map((item, i) => (
              <label key={i} className="flex items-start gap-3 p-3 hover:bg-muted rounded-lg transition cursor-pointer">
                <input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 mt-1 rounded border-border" />
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="p-6 bg-card rounded-2xl border border-border">
          <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Privacy & Security
          </h2>
          <div className="space-y-4">
            <button className="w-full px-4 py-3 bg-input border border-border rounded-lg text-left hover:bg-muted transition">
              <p className="font-medium text-sm">Change Password</p>
              <p className="text-xs text-muted-foreground mt-1">Update your password to keep your account secure</p>
            </button>
            <button className="w-full px-4 py-3 bg-input border border-border rounded-lg text-left hover:bg-muted transition">
              <p className="font-medium text-sm">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground mt-1">Enable 2FA for enhanced security</p>
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-6 bg-card rounded-2xl border border-border">
          <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Management
          </h2>
          <div className="space-y-4">
            <button className="w-full px-4 py-3 bg-input border border-border rounded-lg text-left hover:bg-muted transition">
              <p className="font-medium text-sm">Export Data</p>
              <p className="text-xs text-muted-foreground mt-1">Download your energy data in CSV format</p>
            </button>
            <button className="w-full px-4 py-3 bg-input border border-border rounded-lg text-left hover:bg-muted transition">
              <p className="font-medium text-sm">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-1">Permanently delete your account and data</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
