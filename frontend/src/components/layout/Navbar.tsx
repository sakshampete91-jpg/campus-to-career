'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Shield, Briefcase, FileText, LayoutDashboard, ChevronDown, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { isAuthenticated } from '@/lib/auth'

const navLinks = [
  { href: '/marketplace', label: 'Opportunities' },
  { href: '/trustcheck', label: 'TrustCheck' },
  { href: '/resume', label: 'Resume AI' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/applications', label: 'Tracker' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [pathname])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-navy/90 backdrop-blur-md border-b border-border shadow-lg'
          : 'bg-transparent'
      )}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-text-primary hover:text-emerald transition-colors"
            aria-label="Campus to Career home"
          >
            <div className="h-8 w-8 rounded-lg bg-emerald flex items-center justify-center flex-shrink-0">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span>
              Campus<span className="text-emerald">to</span>Career
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6" role="list">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-text-primary',
                  pathname === link.href
                    ? 'text-emerald'
                    : 'text-text-secondary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA / Profile */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-navy-secondary border border-border text-sm text-text-secondary hover:text-text-primary transition-colors"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <div className="h-7 w-7 rounded-full bg-emerald/20 border border-emerald/30 flex items-center justify-center text-emerald font-semibold text-xs">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="max-w-[120px] truncate text-xs font-medium text-text-primary">
                  {user?.full_name || 'Alex Rivera'}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-navy-elevated border border-border rounded-xl shadow-xl py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-xs font-semibold text-text-primary">{user?.full_name || 'Alex Rivera'}</p>
                    <p className="text-[11px] text-emerald">Student Demo • Zero-Login Active</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-navy-secondary transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Student Dashboard
                  </Link>
                  <Link
                    href="/applications"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-navy-secondary transition-colors"
                  >
                    <Briefcase className="h-4 w-4" />
                    Application Tracker
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-navy-secondary transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Profile & Skills
                  </Link>
                  <hr className="my-1 border-border" />
                  <Link
                    href="/employer/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-champagne hover:bg-navy-secondary transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    Employer Portal
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-text-secondary hover:text-text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-navy-elevated border-t border-border">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-emerald/10 text-emerald'
                    : 'text-text-secondary hover:text-text-primary hover:bg-navy-secondary'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-border mt-2">
              <Link href="/dashboard">
                <Button variant="primary" size="md" className="w-full">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Student Dashboard
                </Button>
              </Link>
              <Link href="/employer/dashboard">
                <Button variant="outline" size="md" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Employer Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
