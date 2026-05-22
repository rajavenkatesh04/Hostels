import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'SRM Hostels — Kattankulathur',
  description:
    'Browse, compare, and choose your SRM Kattankulathur hostel. 2026-27 fee structure and room configurations for first-year B.Tech / M.Tech students.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NuqsAdapter>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          {/*<SiteFooter />*/}
          <Toaster richColors position="top-right" />
        </NuqsAdapter>
      </body>
    </html>
  )
}
