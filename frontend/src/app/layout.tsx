import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AutoAuth } from '@/components/layout/AutoAuth'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Campus to Career — From Skills to Opportunities',
    template: '%s | Campus to Career',
  },
  description:
    'Campus to Career connects students with verified internships and opportunities. Skills-based matching, AI resume tailoring, and TrustCheck fraud detection.',
  keywords: ['internship', 'career', 'students', 'skills', 'opportunities', 'campus'],
  openGraph: {
    title: 'Campus to Career — From Skills to Opportunities',
    description: 'Skills-based matching, TrustCheck fraud detection, and AI resume tailoring.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B1020',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-navy text-primary-text font-sans antialiased min-h-screen flex flex-col">
        <AutoAuth />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#121A2B',
              border: '1px solid #1E2D45',
              color: '#F8FAFC',
            },
          }}
        />
      </body>
    </html>
  )
}
