'use client'

import { useMemo } from 'react'
import {
  useQueryStates,
  parseAsBoolean,
  parseAsStringLiteral,
  parseAsNumberLiteral,
} from 'nuqs'
import { Info } from 'lucide-react'
import type { Hostel, Room } from '@/types/hostel'
import { Button } from '@/components/ui/button'
import { HostelCard } from '@/components/hostel-card'

const genderParser = parseAsStringLiteral(['boys', 'girls'] as const)
const washroomParser = parseAsStringLiteral(['attached', 'common'] as const)
const yearParser = parseAsNumberLiteral([1, 2, 3, 4] as const)
const sharingParser = parseAsNumberLiteral([2, 3, 4, 5, 6] as const)

const filterParsers = {
  gender: genderParser,
  year: yearParser,
  ac: parseAsBoolean,
  washroom: washroomParser,
  sharing: sharingParser,
}

const campuses = [
  {
    value: 'kattankulathur',
    label: 'Kattankulathur, Chennai',
    available: true,
  },
] as const

const sharingOptions = [2, 3, 4, 5, 6] as const

type Filters = {
  gender: 'boys' | 'girls' | null
  year: 1 | 2 | 3 | 4 | null
  ac: boolean | null
  washroom: 'attached' | 'common' | null
  sharing: 2 | 3 | 4 | 5 | 6 | null
}

function roomMatchesAll(room: Room, filters: Filters) {
  if (filters.ac !== null && room.ac !== filters.ac) return false
  if (filters.washroom !== null && room.washroom !== filters.washroom) return false
  if (filters.sharing !== null && room.sharing !== filters.sharing) return false
  return true
}

function roomScore(room: Room, filters: Filters) {
  let score = 0
  if (filters.ac !== null && room.ac === filters.ac) score++
  if (filters.washroom !== null && room.washroom === filters.washroom) score++
  if (filters.sharing !== null && room.sharing === filters.sharing) score++
  return score
}

export function Picker({ hostels }: { hostels: Hostel[] }) {
  const [filters, setFilters] = useQueryStates(filterParsers)

  const results = useMemo(() => {
    const hardFiltered = hostels.filter((h) => {
      if (filters.gender && h.gender !== filters.gender) return false
      if (filters.year && h.year !== filters.year) return false
      return true
    })

    const hasRoomFilter =
      filters.ac !== null || filters.washroom !== null || filters.sharing !== null

    if (!hasRoomFilter) {
      return { type: 'exact' as const, hostels: hardFiltered }
    }

    const exact = hardFiltered.filter((h) =>
      h.rooms.some((r) => roomMatchesAll(r, filters))
    )

    if (exact.length > 0) {
      return { type: 'exact' as const, hostels: exact }
    }

    const closest = hardFiltered
      .map((h) => {
        const best = Math.max(0, ...h.rooms.map((r) => roomScore(r, filters)))
        return { hostel: h, score: best }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((entry) => entry.hostel)

    return { type: 'closest' as const, hostels: closest }
  }, [hostels, filters])

  const anyFilterSet =
    filters.gender !== null ||
    filters.year !== null ||
    filters.ac !== null ||
    filters.washroom !== null ||
    filters.sharing !== null

  function clearAll() {
    setFilters({
      gender: null,
      year: null,
      ac: null,
      washroom: null,
      sharing: null,
    })
  }

  const forwardParams = {
    ac: filters.ac,
    washroom: filters.washroom,
    sharing: filters.sharing,
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Find your hostel
        </h1>
        <p className="text-muted-foreground">
          Answer a few questions and we&apos;ll show you the hostels that match.
        </p>
      </header>

      <div className="space-y-8">
        {/* 1. Gender */}
        <FilterSection number={1} title="Select your gender">
          <div className="grid grid-cols-2 gap-3 sm:max-w-md">
            <ToggleButton
              selected={filters.gender === 'boys'}
              onClick={() =>
                setFilters({
                  gender: filters.gender === 'boys' ? null : 'boys',
                })
              }
            >
              Boys
            </ToggleButton>
            <ToggleButton
              selected={filters.gender === 'girls'}
              onClick={() =>
                setFilters({
                  gender: filters.gender === 'girls' ? null : 'girls',
                })
              }
            >
              Girls
            </ToggleButton>
          </div>
        </FilterSection>

        {/* 2. Campus */}
        <FilterSection
          number={2}
          title="Which campus are you looking for?"
        >
          <div className="flex flex-wrap gap-3">
            {campuses.map((c) => (
              <ToggleButton
                key={c.value}
                selected={c.available}
                disabled={!c.available}
                onClick={() => {}}
              >
                {c.label}
              </ToggleButton>
            ))}
          </div>
        </FilterSection>

        {/* 3. Year */}
        <FilterSection number={3} title="Which year of study are you in?">
          <NoteCallout>
            The booking period for 2nd, 3rd, and 4th-year students is now
            closed. Please visit the hostel office for more information.
          </NoteCallout>
          <div className="flex flex-wrap gap-3 pt-3">
            <ToggleButton
              selected={filters.year === 1}
              onClick={() =>
                setFilters({ year: filters.year === 1 ? null : 1 })
              }
            >
              1st Year
            </ToggleButton>
          </div>
        </FilterSection>

        {/* 4. AC */}
        <FilterSection number={4} title="AC or Non-AC?">
          <div className="grid grid-cols-2 gap-3 sm:max-w-md">
            <ToggleButton
              selected={filters.ac === true}
              onClick={() =>
                setFilters({ ac: filters.ac === true ? null : true })
              }
            >
              AC
            </ToggleButton>
            <ToggleButton
              selected={filters.ac === false}
              onClick={() =>
                setFilters({ ac: filters.ac === false ? null : false })
              }
            >
              Non-AC
            </ToggleButton>
          </div>
        </FilterSection>

        {/* 5. Washroom */}
        <FilterSection number={5} title="Preferred bathroom setup?">
          <div className="grid grid-cols-2 gap-3 sm:max-w-md">
            <ToggleButton
              selected={filters.washroom === 'attached'}
              onClick={() =>
                setFilters({
                  washroom:
                    filters.washroom === 'attached' ? null : 'attached',
                })
              }
            >
              Attached
            </ToggleButton>
            <ToggleButton
              selected={filters.washroom === 'common'}
              onClick={() =>
                setFilters({
                  washroom: filters.washroom === 'common' ? null : 'common',
                })
              }
            >
              Common
            </ToggleButton>
          </div>
        </FilterSection>

        {/* 6. Sharing */}
        <FilterSection number={6} title="How many roommates?">
          <div className="flex flex-wrap gap-3">
            {sharingOptions.map((n) => (
              <ToggleButton
                key={n}
                selected={filters.sharing === n}
                onClick={() =>
                  setFilters({ sharing: filters.sharing === n ? null : n })
                }
              >
                {n} Sharing
              </ToggleButton>
            ))}
          </div>
        </FilterSection>
      </div>

      <section className="border-t border-border pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <ResultsHeading
            type={results.type}
            count={results.hostels.length}
            anyFilterSet={anyFilterSet}
          />
          {anyFilterSet && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear all filters
            </Button>
          )}
        </div>

        {results.hostels.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground">
              No hostels match your current selection. Try removing a filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.hostels.map((hostel) => (
              <HostelCard
                key={hostel.slug}
                hostel={hostel}
                forwardParams={forwardParams}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function FilterSection({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold tracking-tight text-foreground">
        <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

function ToggleButton({
  selected,
  disabled,
  onClick,
  children,
}: {
  selected: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant={selected ? 'default' : 'outline'}
      size="lg"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
      className="justify-center"
    >
      {children}
    </Button>
  )
}

function NoteCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
      <Info className="mt-0.5 size-4 shrink-0" />
      <p>{children}</p>
    </div>
  )
}

function ResultsHeading({
  type,
  count,
  anyFilterSet,
}: {
  type: 'exact' | 'closest'
  count: number
  anyFilterSet: boolean
}) {
  if (!anyFilterSet) {
    return (
      <h2 className="text-xl font-semibold tracking-tight">
        All hostels ({count})
      </h2>
    )
  }
  if (type === 'exact') {
    return (
      <h2 className="text-xl font-semibold tracking-tight">
        We found {count} perfect match{count === 1 ? '' : 'es'} based on your
        preferences
      </h2>
    )
  }
  return (
    <h2 className="text-xl font-semibold tracking-tight">
      No exact matches, but here are the closest alternatives
    </h2>
  )
}
