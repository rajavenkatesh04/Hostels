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
      <header className="sticky top-0 z-40 w-full border-b border-stone-300 bg-white/95 backdrop-blur-md">
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
                className="h-8 w-auto transition-opacity duration-200 hover:opacity-70"
            />
          </Link>

          {/* Vertical divider after logo */}
          <span
              aria-hidden
              className="hidden h-6 w-px shrink-0 bg-stone-300 md:block"
          />

          <div
              ref={desktopWrapperRef}
              className="relative hidden flex-1 md:flex md:max-w-md"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-stone-400" />
            <Input
                type="search"
                value={query}
                onChange={(e) => onDesktopChange(e.target.value)}
                onFocus={onDesktopFocus}
                onKeyDown={onDesktopKeyDown}
                placeholder="Search hostels..."
                aria-label="Search hostels"
                className={cn(
                    'w-full rounded-sm border-stone-300 bg-white pl-9 text-sm placeholder:text-stone-400 focus-visible:border-[#0c4da2] focus-visible:ring-0',
                    dropdownOpen && 'border-[#0c4da2]'
                )}
            />
            {dropdownOpen && (
                <div className="absolute inset-x-0 top-full z-50 mt-2 max-h-[400px] overflow-y-auto rounded-sm border-2 border-[#0c4da2] bg-white shadow-lg">
                  <SearchResults query={query} onSelect={onDesktopResultSelect} />
                </div>
            )}
          </div>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="group relative px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-stone-600 transition-colors hover:text-[#0c4da2]"
                >
                  {link.label}
                  <span
                      aria-hidden
                      className="absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-[#0c4da2] transition-transform duration-200 group-hover:scale-x-100"
                  />
                </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 md:hidden">
            <Button
                variant="ghost"
                size="icon"
                aria-label="Search hostels"
                className="text-stone-700 hover:bg-stone-100 hover:text-[#0c4da2]"
                onClick={() => setMobileSearchOpen(true)}
            >
              <Search />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="text-stone-700 hover:bg-stone-100 hover:text-[#0c4da2]"
                onClick={() => setMobileNavOpen(true)}
            >
              <Menu />
            </Button>
          </div>
        </div>

        {/* Mobile search sheet */}
        <Sheet open={mobileSearchOpen} onOpenChange={onMobileSearchOpenChange}>
          <SheetContent
              side="top"
              className="flex max-h-[90dvh] flex-col gap-0 border-b-2 border-[#0c4da2] p-0"
          >
            <SheetHeader className="border-b border-stone-200 pr-12">
              <SheetTitle className="sr-only">Search hostels</SheetTitle>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-stone-400" />
                <Input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search hostels..."
                    aria-label="Search hostels"
                    autoFocus
                    className="rounded-sm border-stone-300 bg-white pl-9 pr-9 text-base placeholder:text-stone-400 focus-visible:border-[#0c4da2] focus-visible:ring-0 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                />
                {query.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-sm p-1 text-stone-500 transition-colors hover:bg-stone-100 hover:text-[#0c4da2]"
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

        {/* Mobile nav sheet */}
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent
              side="right"
              className="w-72 border-l-2 border-[#0c4da2] bg-white"
          >
            <SheetHeader className="border-b border-stone-200 pb-4">
              <SheetTitle className="font-mono text-xs uppercase tracking-[0.2em] text-[#0c4da2]">
                Menu
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col px-2 pt-2">
              {navLinks.map((link, index) => (
                  <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileNavOpen(false)}
                      className="group flex items-baseline gap-3 border-b border-stone-200 px-3 py-4 text-stone-800 transition-colors last:border-0 hover:text-[#0c4da2]"
                  >
                <span className="font-mono text-[10px] tracking-[0.18em] text-stone-400 group-hover:text-[#0c4da2]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                    <span className="font-display text-lg font-medium tracking-tight">
                  {link.label}
                </span>
                  </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </header>
  )
}