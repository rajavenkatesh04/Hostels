'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { createSearchInstance, getSearchableHostels, type SearchableHostel } from '@/lib/search'

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
      <div className="p-6 text-center text-sm text-muted-foreground">
        No results found for &ldquo;{query}&rdquo;
      </div>
    )
  }

  return (
    <ul className="divide-y divide-border">
      {results.map((hostel) => (
        <li key={hostel.slug}>
          <Link
            href={`/hostels/${hostel.slug}`}
            onClick={onSelect}
            className="flex flex-col gap-1.5 px-4 py-3 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
          >
            <ResultRow hostel={hostel} />
          </Link>
        </li>
      ))}
    </ul>
  )
}

function ResultRow({ hostel }: { hostel: SearchableHostel }) {
  const visibleTags = hostel.searchableTags
    .filter((t) => t !== 'Boys' && t !== 'Girls')
    .slice(0, MAX_TAGS_PER_ROW)

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground">{hostel.name}</span>
        <Badge variant={hostel.gender === 'boys' ? 'secondary' : 'outline'}>
          {hostel.gender === 'boys' ? 'Boys' : 'Girls'}
        </Badge>
      </div>
      <div className="text-xs text-muted-foreground">
        {hostel.isOffCampus ? 'Off-campus' : 'On-campus'} · Year {hostel.year}
      </div>
      {visibleTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {visibleTags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </>
  )
}
