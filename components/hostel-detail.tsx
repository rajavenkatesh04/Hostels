'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ArrowUpRight,
  FileText,
  Mail,
  Navigation,
  Phone,
  Snowflake,
  Check,
  Info,
} from 'lucide-react'
import type { Hostel, Room, WashroomType } from '@/types/hostel'
import { cn } from '@/lib/utils'
import { getDirectionsUrl } from '@/lib/maps'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

const BOOKING_URL = 'https://sp.srmist.edu.in/srmiststudentportal'

const yearLabels: Record<number, string> = {
  1: 'First Year',
  2: 'Second Year',
  3: 'Third Year',
  4: 'Fourth Year',
}

function findUrlMatchedRoomIndex(
    hostel: Hostel,
    searchParams: URLSearchParams
): number | null {
  const acStr = searchParams.get('ac')
  const washroomStr = searchParams.get('washroom')
  const sharingStr = searchParams.get('sharing')

  if (!acStr && !washroomStr && !sharingStr) return null

  const ac = acStr === 'true' ? true : acStr === 'false' ? false : null
  const washroom: WashroomType | null =
      washroomStr === 'attached' || washroomStr === 'common' ? washroomStr : null
  const sharingNum = sharingStr ? Number(sharingStr) : NaN
  const sharing = Number.isFinite(sharingNum) ? sharingNum : null

  const idx = hostel.rooms.findIndex(
      (r) =>
          (ac === null || r.ac === ac) &&
          (washroom === null || r.washroom === washroom) &&
          (sharing === null || r.sharing === sharing)
  )
  return idx >= 0 ? idx : null
}

export function HostelDetail({ hostel }: { hostel: Hostel }) {
  const searchParams = useSearchParams()
  const urlMatchedIndex = useMemo(
      () =>
          findUrlMatchedRoomIndex(
              hostel,
              new URLSearchParams(searchParams.toString())
          ),
      [hostel, searchParams]
  )
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(
      urlMatchedIndex ?? 0
  )
  const [laundryEnabled, setLaundryEnabled] = useState(false)

  const selectedRoom = hostel.rooms[selectedRoomIndex]
  const total =
      selectedRoom.price +
      hostel.messFees +
      (laundryEnabled ? hostel.laundryFees : 0)

  const isBoys = hostel.gender === 'boys'

  return (
      <div className="space-y-16">
        {/* Header */}
        <header className="space-y-6 border-b border-stone-300 pb-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs uppercase tracking-[0.18em] text-stone-500">
            <span className="text-[#0c4da2]">{isBoys ? 'Boys' : 'Girls'}</span>
            <span className="text-stone-300">/</span>
            <span>{hostel.isOffCampus ? 'Off-Campus' : 'On-Campus'}</span>
            <span className="text-stone-300">/</span>
            <span>{yearLabels[hostel.year] ?? `Year ${hostel.year}`}</span>
          </div>
          <h1 className="font-display text-[2.75rem] font-medium leading-[1.05] tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
            {hostel.name}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-stone-700">
            {hostel.description}
          </p>
          {(hostel.coordinates || hostel.floorPlanUrl) && (
              <div className="flex flex-wrap gap-3 pt-1">
                {hostel.coordinates && (
                    <Button
                        variant="outline"
                        size="lg"
                        className="rounded-sm border-2 border-[#0c4da2] bg-transparent text-base text-[#0c4da2] hover:bg-[#0c4da2] hover:text-white"
                        render={
                          <a
                              href={getDirectionsUrl(
                                  hostel.coordinates.lat,
                                  hostel.coordinates.lng
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                          />
                        }
                    >
                      <Navigation className="size-4" />
                      Navigate
                    </Button>
                )}
                {hostel.floorPlanUrl && (
                    <Button
                        variant="outline"
                        size="lg"
                        className="rounded-sm border-2 border-[#0c4da2] bg-transparent text-base text-[#0c4da2] hover:bg-[#0c4da2] hover:text-white"
                        render={
                          <a
                              href={hostel.floorPlanUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                          />
                        }
                    >
                      <FileText className="size-4" />
                      Floor Plan
                    </Button>
                )}
              </div>
          )}
        </header>

        <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
          {/* Rooms */}
          <section className="min-w-0 space-y-6">
            <SectionHeader
                number="01"
                title="Available Room Types"
                count={hostel.rooms.length}
            />
            <div className="space-y-3">
              {hostel.rooms.map((room, index) => (
                  <RoomOption
                      key={`${room.ac}-${room.washroom}-${room.sharing}-${index}`}
                      room={room}
                      selected={selectedRoomIndex === index}
                      isUrlMatch={urlMatchedIndex === index}
                      onSelect={() => setSelectedRoomIndex(index)}
                  />
              ))}
            </div>
          </section>

          {/* Pricing — slightly smaller on mobile */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-sm border-2 border-[#0c4da2] bg-white">
              <div className="border-b-2 border-[#0c4da2] px-5 py-4 md:px-6 md:py-5">
                <h2 className="font-display text-xl font-medium text-stone-900 md:text-2xl">
                  Pricing Summary
                </h2>
              </div>

              <div className="space-y-4 px-5 py-5 md:space-y-5 md:px-6 md:py-6">
                <PriceRow
                    label="Selected Room"
                    value={selectedRoom.price}
                    sublabel={describeRoom(selectedRoom)}
                />
                <Divider />
                <PriceRow
                    label="Mess Fee"
                    value={hostel.messFees}
                    sublabel="Mandatory"
                />
                <Divider />
                <div className="flex items-start justify-between gap-3">
                  <label className="flex cursor-pointer items-start gap-3">
                    <Switch
                        checked={laundryEnabled}
                        onCheckedChange={setLaundryEnabled}
                        className="mt-1"
                    />
                    <span className="leading-tight">
                    <span className="text-sm text-stone-800 md:text-base">
                      Laundry
                    </span>
                    <span className="mt-0.5 block text-xs text-stone-500">
                      Optional
                    </span>
                  </span>
                  </label>
                  <span
                      className={cn(
                          'tabular-nums transition-colors text-sm md:text-base',
                          !laundryEnabled
                              ? 'text-stone-400 line-through'
                              : 'font-medium text-stone-900'
                      )}
                  >
                  ₹{hostel.laundryFees.toLocaleString('en-IN')}
                </span>
                </div>
              </div>

              <div className="border-t-2 border-[#0c4da2] bg-[#0c4da2]/[0.05] px-5 py-4 md:px-6 md:py-5">
                <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-700 md:text-xs">
                  Total / Year
                </span>
                  <span className="font-display text-[1.75rem] font-medium leading-none tabular-nums text-[#0c4da2] md:text-[2rem]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
                </div>
              </div>

              <div className="p-3">
                <Button
                    size="lg"
                    className="group h-auto w-full rounded-sm bg-[#0c4da2] px-6 py-3.5 text-sm font-medium tracking-wide text-white hover:bg-[#093d82] md:py-4 md:text-base"
                    render={
                      <a
                          href={BOOKING_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                      />
                    }
                >
                  Proceed to Booking
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:size-5" />
                </Button>
                <p className="mt-2.5 text-center text-xs text-stone-500">
                  Opens the SRM Student Portal in a new tab
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer info */}
        <div className="grid gap-x-16 gap-y-10 border-t border-stone-300 pt-12 md:grid-cols-2">
          <section className="space-y-5">
            <SectionHeader number="02" title="Warden" />
            <dl className="space-y-3 text-base">
              <ContactRow icon={null} label="Name" value={hostel.wardenName} />
              <ContactRow
                  icon={<Phone className="size-4" />}
                  label="Phone"
                  value={hostel.wardenContact}
                  href={`tel:${hostel.wardenContact}`}
              />
              <ContactRow
                  icon={<Mail className="size-4" />}
                  label="Email"
                  value={hostel.wardenEmail}
                  href={`mailto:${hostel.wardenEmail}`}
              />
            </dl>
          </section>

          <section className="space-y-5">
            <SectionHeader number="03" title="Notes" />
            <ul className="space-y-3 text-base leading-relaxed text-stone-700">
              <NoteItem>
                All prices are annual fees for the 2026–27 academic year.
              </NoteItem>
              <NoteItem>
                Mess fee is mandatory and is included in the total above.
              </NoteItem>
              <NoteItem>
                Laundry can be added or dropped at any point during the year.
              </NoteItem>
              <NoteItem>
                Booking is first-come, first-served via the SRM student portal.
              </NoteItem>
              {hostel.isOffCampus && (
                  <NoteItem>
                    This is an off-campus hostel — plan transport accordingly.
                  </NoteItem>
              )}
            </ul>
          </section>
        </div>
      </div>
  )
}

/* ---------- Subcomponents ---------- */

function SectionHeader({
                         number,
                         title,
                         count,
                       }: {
  number: string
  title: string
  count?: number
}) {
  return (
      <div className="flex items-baseline gap-3">
      <span className="font-mono text-xs tracking-[0.2em] text-[#0c4da2]">
        {number}
      </span>
        <h2 className="font-display text-2xl font-medium tracking-tight text-stone-900 md:text-[1.75rem]">
          {title}
          {typeof count === 'number' && (
              <span className="ml-2 text-stone-400">({count})</span>
          )}
        </h2>
      </div>
  )
}

function RoomOption({
                      room,
                      selected,
                      isUrlMatch,
                      onSelect,
                    }: {
  room: Room
  selected: boolean
  isUrlMatch?: boolean
  onSelect: () => void
}) {
  return (
      <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className={cn(
              'group relative block w-full rounded-sm border-2 px-5 py-5 text-left transition-all duration-150 md:px-6 md:py-6',
              selected
                  ? 'border-[#0c4da2] bg-[#0c4da2]/[0.04]'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
          )}
      >
        {isUrlMatch && (
            <span className="absolute -top-2.5 left-5 bg-white px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0c4da2]">
          Your Preference
        </span>
        )}
        <div className="flex items-start justify-between gap-6">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            {/* Radio */}
            <span
                className={cn(
                    'mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    selected
                        ? 'border-[#0c4da2] bg-[#0c4da2]'
                        : 'border-stone-300 bg-white group-hover:border-stone-400'
                )}
            >
            {selected && (
                <Check className="size-3 text-white" strokeWidth={3} />
            )}
          </span>
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-lg font-medium text-stone-900 md:text-xl">
              <span className="inline-flex items-center gap-1.5">
                {room.ac && (
                    <Snowflake
                        className={cn(
                            'size-4',
                            selected ? 'text-[#0c4da2]' : 'text-stone-500'
                        )}
                    />
                )}
                {room.ac ? 'AC' : 'Non-AC'}
              </span>
                <Dot />
                <span>
                {room.washroom === 'attached' ? 'Attached' : 'Common'} Washroom
              </span>
                <Dot />
                <span>{room.sharing}-Share</span>
              </div>
              {room.notes && (
                  <p className="inline-flex items-start gap-1.5 rounded-sm bg-amber-50 px-2 py-1 text-sm leading-snug text-amber-900 ring-1 ring-amber-200">
                    <Info className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
                    <span>{room.notes}</span>
                  </p>
              )}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p
                className={cn(
                    'font-display text-xl font-medium tabular-nums md:text-2xl',
                    selected ? 'text-[#0c4da2]' : 'text-stone-900'
                )}
            >
              ₹{room.price.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-stone-500">room only</p>
          </div>
        </div>
      </button>
  )
}

function Dot() {
  return (
      <span
          aria-hidden
          className="inline-block size-1 rounded-full bg-stone-300"
      />
  )
}

function Divider() {
  return <div className="h-px bg-stone-200" />
}

function PriceRow({
                    label,
                    value,
                    sublabel,
                  }: {
  label: string
  value: number
  sublabel?: string
}) {
  return (
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-stone-800 md:text-base">{label}</p>
          {sublabel && (
              <p className="mt-0.5 text-xs text-stone-500">{sublabel}</p>
          )}
        </div>
        <span className="shrink-0 text-sm font-medium tabular-nums text-stone-900 md:text-base">
        ₹{value.toLocaleString('en-IN')}
      </span>
      </div>
  )
}

function ContactRow({
                      icon,
                      label,
                      value,
                      href,
                    }: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const content = (
      <span className="flex items-center gap-2 text-stone-900">
      {icon && <span className="text-stone-400">{icon}</span>}
        <span className={cn(href && 'hover:text-[#0c4da2] hover:underline')}>
        {value}
      </span>
    </span>
  )
  return (
      <div className="grid grid-cols-[90px_1fr] items-baseline gap-3 border-b border-stone-200 pb-3 last:border-0 last:pb-0">
        <dt className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">
          {label}
        </dt>
        <dd className="break-all">
          {href ? <a href={href}>{content}</a> : content}
        </dd>
      </div>
  )
}

function NoteItem({ children }: { children: React.ReactNode }) {
  return (
      <li className="flex gap-3">
      <span aria-hidden className="select-none font-mono text-stone-300">
        —
      </span>
        <span>{children}</span>
      </li>
  )
}

function describeRoom(room: Room) {
  const parts = [
    room.ac ? 'AC' : 'Non-AC',
    `${room.sharing}-share`,
    room.washroom === 'attached' ? 'attached WR' : 'common WR',
  ]
  return parts.join(' · ')
}