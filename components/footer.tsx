import Link from "next/link"
import { Mail, Twitter, Linkedin, Github } from "lucide-react"
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
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
            <p className="text-sm font-light text-muted-foreground leading-relaxed">
              Intelligent energy platform for the future. Monitor and optimize renewable energy with real-time
              intelligence.
            </p>
          </div>
          <div>
            <h4 className="font-light text-foreground mb-4 text-sm">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="font-light text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-light text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/" className="font-light text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-light text-foreground mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="font-light text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/" className="font-light text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/" className="font-light text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-light text-foreground mb-4 text-sm">Connect</h4>
            <div className="flex gap-4">
              {[
                { Icon: Mail, href: "mailto:hello@quantum.energy" },
                { Icon: Twitter, href: "https://twitter.com" },
                { Icon: Linkedin, href: "https://linkedin.com" },
                { Icon: Github, href: "https://github.com" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center">
          <p className="text-sm font-light text-muted-foreground">
            © 2025 Quantum Energy Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
