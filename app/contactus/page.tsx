"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useState, useMemo } from "react"
import { Send } from "lucide-react"

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)

  const coords = useMemo(() => {
    // Random-ish coordinates within California / US West for demo purposes
    const lat = 34 + Math.random() * 10 // 34 -> 44
    const lng = -123 + Math.random() * 6 // -123 -> -117
    return { lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate sending
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  // Increase bbox delta so the embedded map is less zoomed-in (shows a wider area)
  const delta = 0.6
  const bbox = `${coords.lng - delta}%2C${coords.lat - delta}%2C${coords.lng + delta}%2C${coords.lat + delta}`
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`
  const openLink = `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=12/${coords.lat}/${coords.lng}`

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-24 md:py-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-light leading-tight mb-4 text-foreground">Contact us</h1>
            <p className="text-xl font-light text-muted-foreground mb-8">Have a question or need support? Send us a message.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-card rounded-2xl border border-border">
              <h2 className="text-lg font-medium mb-4">Get in touch</h2>
              <p className="text-muted-foreground mb-4">Email us at <a href="mailto:support@labview.example" className="text-primary hover:underline">support@labview.example</a> or use the form.</p>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Headquarters</p>
                  <p className="text-foreground">123 Renewable Way, San Francisco, CA</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 bg-card rounded-2xl border border-border">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-light mb-2">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 bg-input border border-border rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Email</label>
                  <input name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 bg-input border border-border rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} className="w-full px-4 py-3 bg-input border border-border rounded-lg h-32" />
                </div>

                <button type="submit" className="px-4 py-3 bg-primary text-primary-foreground rounded-lg inline-flex items-center gap-2">
                  {sent ? (
                    "Message sent"
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Map section */}
          <div className="mt-12">
            <h3 className="text-lg font-medium mb-4">Our nearest office (demo)</h3>
            <div className="rounded-lg overflow-hidden border border-border">
              <iframe
                title="Office location"
                src={mapSrc}
                className="w-full h-72"
                style={{ border: 0 }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Random demo location: <a href={openLink} target="_blank" rel="noreferrer" className="text-primary hover:underline">Open in OpenStreetMap</a></p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
