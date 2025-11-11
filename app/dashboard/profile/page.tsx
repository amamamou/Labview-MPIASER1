"use client"

import { useState, useEffect } from "react"
import { Camera, Mail, MapPin, Phone } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    company: "GreenTech Solutions",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    role: "Energy Manager",
    bio: "Passionate about renewable energy optimization and sustainable practices.",
  })
  const [formData, setFormData] = useState<typeof profile | null>(null)

  const handleChange = (field: string, value: string) => {
    // update local form state while editing
    if (formData) {
      setFormData({ ...formData, [field]: value })
    }
  }

  useEffect(() => {
    // load user profile from localStorage (same behavior as /profile)
    const authData = localStorage.getItem("user_profile")
    if (!authData) {
      // not authenticated -> redirect to signin
      window.location.href = "/auth/signin"
      return
    }
    try {
      const data = JSON.parse(authData)
      setProfile(data)
      setFormData(data)
      setIsAuthenticated(true)
    } catch (e) {
      // if parsing fails, redirect to signin to re-auth
      window.location.href = "/auth/signin"
    }
  }, [])

  const handleSave = () => {
    if (!formData) return
    localStorage.setItem("user_profile", JSON.stringify(formData))
    setProfile(formData)
    setIsEditing(false)
    alert("Profile updated successfully!")
  }

  return (
      <div className="min-h-screen bg-background">
      <Navbar />
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Avatar Section */}
        <div className="p-6 bg-card rounded-2xl border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Profile Picture</h2>
            <button className="text-primary hover:underline text-sm font-medium">Change</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-3xl">
              JD
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition">
              <Camera className="w-4 h-4" />
              Upload Photo
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-6 bg-card rounded-2xl border border-border">
            <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg">Personal Information</h2>
            <div className="flex items-center gap-4">
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="text-sm font-medium px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                >
                  Save
                </button>
              )}
              <button
                onClick={() => {
                  // toggle edit mode; if cancelling, reset formData to profile
                  if (isEditing && formData) {
                    setFormData(profile)
                  }
                  setIsEditing(!isEditing)
                }}
                className="text-primary hover:underline text-sm font-medium"
              >
                {isEditing ? "Done" : "Edit"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData?.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <input
                  type="text"
                  value={formData?.role || ""}
                  onChange={(e) => handleChange("role", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="flex items-center gap-2 px-4 py-2 bg-input border border-border rounded-lg">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={formData?.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={!isEditing}
                  className="flex-1 bg-transparent disabled:opacity-50 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <div className="flex items-center gap-2 px-4 py-2 bg-input border border-border rounded-lg">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData?.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={!isEditing}
                    className="flex-1 bg-transparent disabled:opacity-50 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="flex items-center gap-2 px-4 py-2 bg-input border border-border rounded-lg">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData?.location || ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                    disabled={!isEditing}
                    className="flex-1 bg-transparent disabled:opacity-50 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                value={formData?.company || ""}
                onChange={(e) => handleChange("company", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={formData?.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg disabled:opacity-50 resize-none h-24"
              />
            </div>
          </div>
        </div>

        {/* Account Preferences */}
        <div className="p-6 bg-card rounded-2xl border border-border">
          <h2 className="font-semibold text-lg mb-6">Account Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border" />
              <span className="text-sm">Receive email notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border" />
              <span className="text-sm">Receive SMS alerts for system issues</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded border-border" />
              <span className="text-sm">Share analytics with team members</span>
            </label>
          </div>
        </div>
      </div>
    </div>
<Footer />
    </div>
  )
}
