'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SearchResults } from '@/components/search-results'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/hostels', label: 'Hostels' },
  { href: '/choose', label: 'Choose' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
]

export function SiteHeader() {
  const [query, setQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const desktopWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      const wrapper = desktopWrapperRef.current
      if (wrapper && !wrapper.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const onDesktopChange = (value: string) => {
    setQuery(value)
    setDropdownOpen(value.trim().length > 0)
  }

  const onDesktopKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setQuery('')
      setDropdownOpen(false)
      e.currentTarget.blur()
    }
  }

  const onDesktopFocus = () => {
    if (query.trim().length > 0) setDropdownOpen(true)
  }

  const onDesktopResultSelect = () => {
    setQuery('')
    setDropdownOpen(false)
  }

  const onMobileSearchOpenChange = (open: boolean) => {
    setMobileSearchOpen(open)
    if (!open) setQuery('')
  }

  const onMobileResultSelect = () => {
    setMobileSearchOpen(false)
    setQuery('')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
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

        <div
          ref={desktopWrapperRef}
          className="relative hidden flex-1 md:flex md:max-w-md"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => onDesktopChange(e.target.value)}
            onFocus={onDesktopFocus}
            onKeyDown={onDesktopKeyDown}
            placeholder="Search hostels..."
            aria-label="Search hostels"
            className={cn(
              'w-full pl-9',
              dropdownOpen && 'ring-2 ring-ring/30'
            )}
          />
          {dropdownOpen && (
            <div className="absolute inset-x-0 top-full z-50 mt-2 max-h-[400px] overflow-y-auto rounded-xl border border-border bg-white shadow-lg">
              <SearchResults query={query} onSelect={onDesktopResultSelect} />
            </div>
          )}
        </div>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
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

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search hostels"
            onClick={() => setMobileSearchOpen(true)}
          >
            <Search />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu />
          </Button>
        </div>
      </div>

      <Sheet open={mobileSearchOpen} onOpenChange={onMobileSearchOpenChange}>
        <SheetContent
          side="top"
          className="flex max-h-[90dvh] flex-col gap-0 p-0"
        >
          <SheetHeader className="border-b border-border pr-12">
            <SheetTitle className="sr-only">Search hostels</SheetTitle>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search hostels..."
                aria-label="Search hostels"
                autoFocus
                className="border border-input bg-background pl-9 pr-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <SearchResults query={query} onSelect={onMobileResultSelect} />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col px-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
