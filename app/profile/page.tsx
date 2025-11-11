"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react"
import { Mail, MapPin, Phone, Save } from "lucide-react"

interface Profile {
  name: string
  email: string
  image: string
  company?: string
  location?: string
  phone?: string
}

export default function Profile() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [formData, setFormData] = useState<Profile | null>(null)

  useEffect(() => {
    const authData = localStorage.getItem("user_profile")
    if (!authData) {
      window.location.href = "/auth/signin"
      return
    }
    const data = JSON.parse(authData)
    setProfile(data)
    setFormData(data)
    setIsAuthenticated(true)
  }, [])

  const handleInputChange = (field: keyof Profile, value: string) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value,
      })
    }
  }

  const handleSave = () => {
    if (formData) {
      localStorage.setItem("user_profile", JSON.stringify(formData))
      setProfile(formData)
      alert("Profile updated successfully!")
    }
  }

  if (!isAuthenticated || !formData) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-light mb-2 text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground font-light">Manage your account information</p>
          </div>

          <div
            className="bg-card border border-border rounded-lg p-8"
            style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}
          >
            {/* Avatar */}
            <div className="mb-8 flex items-center gap-6">
              <img
                src={formData.image || "/placeholder.svg"}
                alt={formData.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20"
              />
              <div>
                <h2 className="text-2xl font-normal text-foreground">{formData.name}</h2>
                <p className="text-muted-foreground font-light">{formData.email}</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6 border-t border-border pt-8">
              {[
                { label: "Full Name", field: "name" as const, icon: null },
                { label: "Email", field: "email" as const, icon: Mail },
                { label: "Company", field: "company" as const, icon: null },
                { label: "Location", field: "location" as const, icon: MapPin },
                { label: "Phone", field: "phone" as const, icon: Phone },
              ].map((item, i) => (
                <div key={i}>
                  <label className="block text-sm font-normal text-foreground mb-2">{item.label}</label>
                  <div className="relative">
                    {item.icon && (
                      <item.icon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                    )}
                    <input
                      type="text"
                      value={formData[item.field] || ""}
                      onChange={(e) => handleInputChange(item.field, e.target.value)}
                      className={`w-full ${item.icon ? "pl-10" : "px-4"} py-2.5 bg-background border border-border rounded-lg font-light text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                      disabled={item.field === "email"}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded font-normal hover:bg-primary/90 transition"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
