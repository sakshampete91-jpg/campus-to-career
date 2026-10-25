import Link from 'next/link'
import { Briefcase, Github, ExternalLink } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'TrustCheck', href: '/trustcheck' },
    { label: 'Resume AI', href: '/resume' },
    { label: 'Application Tracker', href: '/applications' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'For Employers', href: '/employer/dashboard' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  Community: [
    { label: 'GitHub', href: 'https://github.com', external: true },
    { label: 'Documentation', href: '#', external: true },
    { label: 'Contributing', href: '#', external: true },
    { label: 'Hacktoberfest', href: '#', external: true },
  ],
}

export function Footer() {
  return (
    <footer className="bg-navy-elevated border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-text-primary">
              <div className="h-8 w-8 rounded-lg bg-emerald flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <span>
                Campus<span className="text-emerald">to</span>Career
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed">
              From Skills to Opportunities. A free, open-source platform connecting students with
              verified internships and career opportunities.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
              Open Source on GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-semibold text-text-primary">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
                      >
                        {link.label}
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} Campus to Career. Open source. Built with ❤️ for students.
          </p>
          <p className="text-xs text-text-secondary">
            TrustCheck is a provisional tool. Not legal advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
