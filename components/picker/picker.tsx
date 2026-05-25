'use client'

import type { ComponentType, ReactNode } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import {
  useQueryStates,
  parseAsBoolean,
  parseAsStringLiteral,
  parseAsNumberLiteral,
} from 'nuqs'
import {
  Bath,
  Bed,
  Building2,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Mars,
  Snowflake,
  Users,
  Venus,
  Wind,
} from 'lucide-react'
import type { Hostel, Room } from '@/types/hostel'
import { Button } from '@/components/ui/button'
import { HostelCard } from '@/components/hostel-card'

const genderParser = parseAsStringLiteral(['boys', 'girls'] as const)
const washroomParser = parseAsStringLiteral(['attached', 'common'] as const)
const yearParser = parseAsNumberLiteral([1, 2, 3, 4] as const)
const sharingParser = parseAsNumberLiteral([2, 3, 4, 5, 6, 7] as const)

const filterParsers = {
  gender: genderParser,
  year: yearParser,
  ac: parseAsBoolean,
  washroom: washroomParser,
  sharing: sharingParser,
}

const sharingOptions = [2, 3, 4, 5, 6, 7] as const

type Filters = {
  gender: 'boys' | 'girls' | null
  year: 1 | 2 | 3 | 4 | null
  ac: boolean | null
  washroom: 'attached' | 'common' | null
  sharing: 2 | 3 | 4 | 5 | 6 | 7 | null
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

function computeCompletion(filters: Filters): boolean[] {
  return [
    filters.gender !== null, // 0 - gender
    true, // 1 - campus (auto)
    true, // 2 - year (auto)
    filters.ac !== null, // 3 - ac
    filters.washroom !== null, // 4 - washroom
    filters.sharing !== null, // 5 - sharing
  ]
}

function computeActiveIndex(filters: Filters): number | null {
  const completion = computeCompletion(filters)
  const idx = completion.findIndex((done) => !done)
  return idx === -1 ? null : idx
}

export function Picker({ hostels }: { hostels: Hostel[] }) {
  const [filters, setFilters] = useQueryStates(filterParsers)
  const [isSelectionsExpanded, setIsSelectionsExpanded] = useState(false)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  const completion = useMemo(() => computeCompletion(filters), [filters])
  const activeIndex = useMemo(() => computeActiveIndex(filters), [filters])

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

  const anyUserFilterSet =
      filters.gender !== null ||
      filters.ac !== null ||
      filters.washroom !== null ||
      filters.sharing !== null

  const activeFilterCount =
      (filters.gender !== null ? 1 : 0) +
      (filters.ac !== null ? 1 : 0) +
      (filters.washroom !== null ? 1 : 0) +
      (filters.sharing !== null ? 1 : 0)
  const showResults = activeFilterCount >= 2

  const scrollToSection = useCallback((index: number) => {
    requestAnimationFrame(() => {
      sectionRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    })
  }, [])

  const handleAnswered = useCallback(
      (nextFilters: Filters) => {
        const nextIdx = computeActiveIndex(nextFilters)
        if (nextIdx !== null) scrollToSection(nextIdx)
      },
      [scrollToSection]
  )

  function clearAll() {
    setFilters({
      gender: null,
      year: null,
      ac: null,
      washroom: null,
      sharing: null,
    })
    setIsSelectionsExpanded(false)
  }

  const forwardParams = {
    ac: filters.ac,
    washroom: filters.washroom,
    sharing: filters.sharing,
  }

  // -- selection pills for sticky bar --
  const pills: { key: string; label: string; sectionIndex: number }[] = []
  if (filters.gender) {
    pills.push({
      key: 'gender',
      label: filters.gender === 'boys' ? 'Boys' : 'Girls',
      sectionIndex: 0,
    })
  }
  pills.push({ key: 'campus', label: 'Kattankulathur', sectionIndex: 1 })
  pills.push({ key: 'year', label: '1st Year', sectionIndex: 2 })
  if (filters.ac !== null) {
    pills.push({
      key: 'ac',
      label: filters.ac ? 'AC' : 'Non-AC',
      sectionIndex: 3,
    })
  }
  if (filters.washroom !== null) {
    pills.push({
      key: 'washroom',
      label: filters.washroom === 'attached' ? 'Attached' : 'Common',
      sectionIndex: 4,
    })
  }
  if (filters.sharing !== null) {
    pills.push({
      key: 'sharing',
      label: `${filters.sharing} Sharing`,
      sectionIndex: 5,
    })
  }

  return (
      <div className="bg-gray-50">
        <header className="bg-white px-4 py-12 text-center sm:py-16">
          <h1 className="mb-4 text-3xl font-light tracking-wide text-gray-900 sm:text-4xl md:text-5xl">
            Let&apos;s find your{' '}
            <span className="bg-linear-to-r from-indigo-600 to-teal-600 bg-clip-text font-medium text-transparent">
            perfect
          </span>{' '}
            hostel!
          </h1>
          <div className="mx-auto mb-6 h-0.5 w-16 bg-linear-to-r from-indigo-600 to-teal-600" />
          <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-gray-700 sm:text-lg">
            Answer a few questions and we&apos;ll find the perfect room for you.
          </p>
        </header>

        {/* Optimized Compact Selections Bar */}
        {anyUserFilterSet && (
            <div className="sticky top-16 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-md">
              <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6">

                {/* Mobile View: Toggle Header */}
                <div className="flex items-center justify-between sm:hidden">
                  <button
                      onClick={() => setIsSelectionsExpanded(!isSelectionsExpanded)}
                      className="flex items-center gap-1.5 text-gray-500"
                  >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                  Selections
                </span>
                    <ChevronDown
                        className={`size-3 transition-transform duration-200 ${
                            isSelectionsExpanded ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                  <button
                      type="button"
                      onClick={clearAll}
                      className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500 transition-colors hover:text-indigo-600"
                  >
                    Clear All
                  </button>
                </div>

                {/* Desktop View & Mobile Expanded View */}
                <div
                    className={`mt-3 sm:mt-0 sm:flex flex-col sm:flex-row sm:items-center gap-3 ${
                        isSelectionsExpanded ? 'flex' : 'hidden'
                    }`}
                >
                  {/* Left Label (Desktop Only) */}
                  <span className="hidden sm:block shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Selections
              </span>

                  {/* Center Area: Pills */}
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    {pills.map((pill) => (
                        <button
                            key={pill.key}
                            type="button"
                            onClick={() => {
                              scrollToSection(pill.sectionIndex)
                              setIsSelectionsExpanded(false) // Close mobile menu on click
                            }}
                            className="group inline-flex items-center gap-1.5 rounded-sm border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 transition-colors hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <span>{pill.label}</span>
                          <Edit3 className="size-3 text-gray-400 transition-colors group-hover:text-indigo-600" />
                        </button>
                    ))}
                  </div>

                  {/* Right Button (Desktop Only) */}
                  <button
                      type="button"
                      onClick={clearAll}
                      className="ml-auto hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500 transition-colors hover:text-indigo-600 sm:block"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
        )}

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          {/* 1. Gender */}
          <FilterSection
              ref={(el) => {
                sectionRefs.current[0] = el
              }}
              number={1}
              title="Select your gender"
              completed={completion[0]}
              active={activeIndex === 0}
          >
            <OptionGrid>
              <OptionButton
                  selected={filters.gender === 'boys'}
                  icon={Mars}
                  label="Boys"
                  onClick={() => {
                    const next: Filters = {
                      ...filters,
                      gender: filters.gender === 'boys' ? null : 'boys',
                    }
                    setFilters({ gender: next.gender })
                    if (next.gender) handleAnswered(next)
                  }}
              />
              <OptionButton
                  selected={filters.gender === 'girls'}
                  icon={Venus}
                  label="Girls"
                  onClick={() => {
                    const next: Filters = {
                      ...filters,
                      gender: filters.gender === 'girls' ? null : 'girls',
                    }
                    setFilters({ gender: next.gender })
                    if (next.gender) handleAnswered(next)
                  }}
              />
            </OptionGrid>
          </FilterSection>

          {/* 2. Campus */}
          <FilterSection
              ref={(el) => {
                sectionRefs.current[1] = el
              }}
              number={2}
              title="Which campus are you looking for?"
              completed
              active={activeIndex === 1}
          >
            <OptionGrid>
              <OptionButton
                  selected
                  icon={Building2}
                  label="Kattankulathur, Chennai"
                  onClick={() => {}}
              />
            </OptionGrid>
          </FilterSection>

          {/* 3. Year */}
          <FilterSection
              ref={(el) => {
                sectionRefs.current[2] = el
              }}
              number={3}
              title="Which year of study are you in?"
              completed
              active={activeIndex === 2}
          >
            <AmberCallout>
              The booking period for 2nd, 3rd, and 4th-year students is now
              closed. Please visit the hostel office for more information.
            </AmberCallout>
            <div className="mt-6">
              <OptionGrid>
                <OptionButton
                    selected
                    icon={BookOpen}
                    label="1st Year"
                    onClick={() => {}}
                />
              </OptionGrid>
            </div>
          </FilterSection>

          {/* 4. AC */}
          <FilterSection
              ref={(el) => {
                sectionRefs.current[3] = el
              }}
              number={4}
              title="AC or Non-AC?"
              completed={completion[3]}
              active={activeIndex === 3}
          >
            <OptionGrid>
              <OptionButton
                  selected={filters.ac === true}
                  icon={Snowflake}
                  label="AC"
                  onClick={() => {
                    const nextAc = filters.ac === true ? null : true
                    setFilters({ ac: nextAc })
                    if (nextAc !== null) handleAnswered({ ...filters, ac: nextAc })
                  }}
              />
              <OptionButton
                  selected={filters.ac === false}
                  icon={Wind}
                  label="Non-AC"
                  onClick={() => {
                    const nextAc = filters.ac === false ? null : false
                    setFilters({ ac: nextAc })
                    if (nextAc !== null) handleAnswered({ ...filters, ac: nextAc })
                  }}
              />
            </OptionGrid>
          </FilterSection>

          {/* 5. Washroom */}
          <FilterSection
              ref={(el) => {
                sectionRefs.current[4] = el
              }}
              number={5}
              title="Preferred bathroom setup?"
              completed={completion[4]}
              active={activeIndex === 4}
          >
            <OptionGrid>
              <OptionButton
                  selected={filters.washroom === 'attached'}
                  icon={Bath}
                  label="Attached"
                  onClick={() => {
                    const next =
                        filters.washroom === 'attached' ? null : 'attached'
                    setFilters({ washroom: next })
                    if (next !== null) handleAnswered({ ...filters, washroom: next })
                  }}
              />
              <OptionButton
                  selected={filters.washroom === 'common'}
                  icon={Users}
                  label="Common"
                  onClick={() => {
                    const next = filters.washroom === 'common' ? null : 'common'
                    setFilters({ washroom: next })
                    if (next !== null) handleAnswered({ ...filters, washroom: next })
                  }}
              />
            </OptionGrid>
          </FilterSection>

          {/* 6. Sharing */}
          <FilterSection
              ref={(el) => {
                sectionRefs.current[5] = el
              }}
              number={6}
              title="How many roommates?"
              completed={completion[5]}
              active={activeIndex === 5}
          >
            <OptionGrid wide>
              {sharingOptions.map((n) => (
                  <OptionButton
                      key={n}
                      selected={filters.sharing === n}
                      icon={Bed}
                      label={`${n} Sharing`}
                      onClick={() => {
                        const next = filters.sharing === n ? null : n
                        setFilters({ sharing: next })
                        if (next !== null)
                          handleAnswered({ ...filters, sharing: next })
                      }}
                  />
              ))}
            </OptionGrid>
          </FilterSection>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {!showResults ? (
              <div className="mx-auto max-w-2xl rounded-xl border-2 border-dashed border-gray-200 bg-white p-10 text-center">
                <p className="font-light text-gray-600">
                  Answer the questions above to see your matches.
                </p>
              </div>
          ) : (
              <>
                <div className="mb-10 text-center">
                  <ResultsHeading
                      type={results.type}
                      count={results.hostels.length}
                  />
                </div>

                {results.hostels.length === 0 ? (
                    <div className="mx-auto max-w-2xl rounded-xl border-2 border-amber-200 bg-white p-8 text-center shadow-lg">
                      <h3 className="mb-3 text-2xl font-light tracking-wide text-gray-900">
                        No Available Matches
                      </h3>
                      <p className="font-medium text-gray-600">
                        No hostels match your current selection. Try removing a
                        filter.
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
              </>
          )}
        </div>
      </div>
  )
}

function FilterSection({
                         ref,
                         number,
                         title,
                         completed,
                         active,
                         children,
                       }: {
  ref: (el: HTMLElement | null) => void
  number: number
  title: string
  completed: boolean
  active: boolean
  children: ReactNode
}) {
  return (
      <section
          ref={ref}
          className={`mb-6 rounded-xl border-2 bg-white p-6 transition-all duration-300 md:p-8 ${
              active ? 'border-blue-500 shadow-lg' : 'border-gray-200'
          }`}
      >
        <h2
            className={`mb-6 flex items-center gap-3 text-xl font-semibold tracking-tight md:text-2xl ${
                completed ? 'text-green-600' : 'text-gray-800'
            }`}
        >
          {completed ? (
              <CheckCircle2 className="size-6 shrink-0" />
          ) : (
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-gray-400 text-xs font-medium text-gray-500">
            {number}
          </span>
          )}
          {title}
        </h2>
        {children}
      </section>
  )
}

function OptionGrid({
                      wide,
                      children,
                    }: {
  wide?: boolean
  children: ReactNode
}) {
  return (
      <div
          className={`grid gap-3 sm:gap-4 ${
              wide
                  ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                  : 'grid-cols-1 sm:grid-cols-2'
          }`}
      >
        {children}
      </div>
  )
}

function OptionButton({
                        selected,
                        icon: Icon,
                        label,
                        onClick,
                      }: {
  selected: boolean
  icon: ComponentType<{ className?: string }>
  label: string
  onClick: () => void
}) {
  return (
      <button
          type="button"
          onClick={onClick}
          aria-pressed={selected}
          className={`flex items-center justify-center gap-3 rounded-lg border-2 p-4 text-sm font-semibold transition-all duration-200 md:p-5 md:text-base ${
              selected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
          }`}
      >
        <Icon className="size-5 shrink-0" />
        <span>{label}</span>
      </button>
  )
}

function AmberCallout({ children }: { children: ReactNode }) {
  return (
      <div
          role="alert"
          className="border-l-4 border-amber-500 bg-amber-100 p-4 text-amber-800"
      >
        <p className="font-bold">Note:</p>
        <p>{children}</p>
      </div>
  )
}

function ResultsHeading({
                          type,
                          count,
                        }: {
  type: 'exact' | 'closest'
  count: number
}) {
  if (type === 'exact') {
    return (
        <>
          <h2 className="mb-3 text-2xl font-light tracking-wide text-gray-900 sm:text-3xl md:text-4xl">
            We found{' '}
            <span className="bg-linear-to-r from-teal-600 to-indigo-600 bg-clip-text font-medium text-transparent">
            {count}
          </span>{' '}
            perfect match{count === 1 ? '' : 'es'} based on your preferences.
          </h2>
          <p className="font-medium text-gray-600">
            These hostels meet all your specified criteria.
          </p>
        </>
    )
  }
  return (
      <>
        <h2 className="mb-3 text-2xl font-light tracking-wide text-gray-900 sm:text-3xl md:text-4xl">
          We couldn&apos;t find an exact match, but we found{' '}
          <span className="bg-linear-to-r from-amber-500 to-orange-500 bg-clip-text font-medium text-transparent">
          {count}
        </span>{' '}
          alternative{count === 1 ? '' : 's'} for you.
        </h2>
        <p className="font-medium text-gray-600">
          These are strong alternatives that closely align with your preferences.
        </p>
      </>
  )
}