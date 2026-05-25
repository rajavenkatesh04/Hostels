'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import {
  createSearchInstance,
  getSearchableHostels,
  type SearchableHostel,
} from '@/lib/search'
import { cn } from '@/lib/utils'

type SearchResultsProps = {
  query: string
  onSelect?: () => void
}

const MAX_RESULTS = 6
const MAX_TAGS_PER_ROW = 3

export function SearchResults({ query, onSelect }: SearchResultsProps) {
  const fuse = useMemo(() => createSearchInstance(getSearchableHostels()), [])

  const results = useMemo(() => {
    const q = query.trim()
    if (!q) return null
    return fuse.search(q).slice(0, MAX_RESULTS).map((r) => r.item)
  }, [fuse, query])

  if (results === null) return null

  if (results.length === 0) {
    return (
        <div className="px-5 py-10 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400">
            No Matches
          </p>
          <p className="mt-2 text-sm text-stone-600">
            Nothing found for{' '}
            <span className="font-medium text-stone-900">
            &ldquo;{query}&rdquo;
          </span>
          </p>
        </div>
    )
  }

  return (
      <div>
        <div className="border-b border-stone-200 bg-stone-50 px-5 py-2.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
            {results.length} {results.length === 1 ? 'Result' : 'Results'}
          </p>
        </div>
        <ul className="divide-y divide-stone-200">
          {results.map((hostel) => (
              <li key={hostel.slug}>
                <Link
                    href={`/hostels/${hostel.slug}`}
                    onClick={onSelect}
                    className="group block px-5 py-4 transition-colors hover:bg-[#0c4da2]/[0.04] focus-visible:bg-[#0c4da2]/[0.04] focus-visible:outline-none"
                >
                  <ResultRow hostel={hostel} />
                </Link>
              </li>
          ))}
        </ul>
      </div>
  )
}

function ResultRow({ hostel }: { hostel: SearchableHostel }) {
  const visibleTags = hostel.searchableTags
      .filter((t) => t !== 'Boys' && t !== 'Girls')
      .slice(0, MAX_TAGS_PER_ROW)

  const isBoys = hostel.gender === 'boys'

  return (
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Metadata kicker */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
            <span className="text-[#0c4da2]">{isBoys ? 'Boys' : 'Girls'}</span>
            <span className="text-stone-300">/</span>
            <span>{hostel.isOffCampus ? 'Off-Campus' : 'On-Campus'}</span>
            <span className="text-stone-300">/</span>
            <span>Year {hostel.year}</span>
          </div>

          {/* Hostel name in display font */}
          <h3 className="font-display text-lg font-medium leading-tight tracking-tight text-stone-900 transition-colors group-hover:text-[#0c4da2]">
            {hostel.name}
          </h3>

          {/* Inline tags */}
          {visibleTags.length > 0 && (
              <p className="text-xs leading-relaxed text-stone-500">
                {visibleTags.map((tag, i) => (
                    <span key={tag}>
                {tag}
                      {i < visibleTags.length - 1 && (
                          <span
                              aria-hidden
                              className="mx-1.5 inline-block size-0.5 translate-y-[-2px] rounded-full bg-stone-300 align-middle"
                          />
                      )}
              </span>
                ))}
              </p>
          )}
        </div>

        <ArrowUpRight
            className={cn(
                'mt-1 size-4 shrink-0 text-stone-300 transition-all',
                'group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0c4da2]'
            )}
        />
      </div>
  )
}