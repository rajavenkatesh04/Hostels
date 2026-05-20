import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const navLinks = [
  { href: '/hostels', label: 'Hostels' },
  { href: '/choose', label: 'Choose' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="SRM Hostels — Home"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/srm-logo.svg"
            alt="SRM Hostels"
            width={600}
            height={203}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search hostels..."
            aria-label="Search hostels"
            className="pl-9"
          />
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <nav className="md:hidden flex items-center justify-around border-t border-border px-2 py-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
