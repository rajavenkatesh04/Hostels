'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ArrowUpRight,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Snowflake,
  Users,
} from 'lucide-react'
import type { Hostel, Room, WashroomType } from '@/types/hostel'
import { cn } from '@/lib/utils'
import { getDirectionsUrl } from '@/lib/maps'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

const BOOKING_URL = 'https://sp.srmist.edu.in/srmiststudentportal'

const yearLabels: Record<number, string> = {
  1: '1st Year',
  2: '2nd Year',
  3: '3rd Year',
  4: '4th Year',
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
    () => findUrlMatchedRoomIndex(hostel, new URLSearchParams(searchParams.toString())),
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
    <div className="space-y-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
        <div className="space-y-8 min-w-0">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`rounded-full px-2.5 py-1 font-medium ${
                  isBoys
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-pink-50 text-pink-700'
                }`}
              >
                {isBoys ? 'Boys' : 'Girls'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 font-medium text-gray-700">
                <MapPin className="size-3" />
                {hostel.isOffCampus ? 'Off-campus' : 'On-campus'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 font-medium text-gray-700">
                <GraduationCap className="size-3" />
                {yearLabels[hostel.year] ?? `Year ${hostel.year}`}
              </span>
            </div>
            <h1 className="font-serif text-3xl font-light tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              {hostel.name}
            </h1>
            <p className="leading-relaxed text-gray-600">
              {hostel.description}
            </p>
            {(hostel.coordinates || hostel.floorPlanUrl) && (
              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap">
                {hostel.coordinates && (
                  <Button
                    size="lg"
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

          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight text-gray-900">
              Available Room Types
            </h2>
            <p className="text-sm text-gray-600">
              Select a room type to update the pricing summary.
            </p>
            <div className="space-y-3 pt-2">
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
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border-2 border-gray-200 bg-white p-6 md:p-8">
            <h2 className="mb-5 text-lg font-semibold tracking-tight text-gray-900">
              Pricing Summary
            </h2>
            <div className="space-y-3 text-sm">
              <PriceRow
                label="Selected room"
                value={selectedRoom.price}
                sublabel={describeRoom(selectedRoom)}
              />
              <PriceRow label="Mess fee (mandatory)" value={hostel.messFees} />
              <div className="flex items-start justify-between gap-3 py-1">
                <label className="flex cursor-pointer items-start gap-2">
                  <Switch
                    checked={laundryEnabled}
                    onCheckedChange={setLaundryEnabled}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-tight text-gray-600">
                    Laundry
                    <span className="block text-xs">(optional)</span>
                  </span>
                </label>
                <span
                  className={cn(
                    'text-sm tabular-nums',
                    !laundryEnabled
                      ? 'text-gray-400 line-through'
                      : 'text-gray-700'
                  )}
                >
                  ₹{hostel.laundryFees.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t-2 border-gray-100 pt-4">
                <span className="font-semibold text-gray-900">
                  Total annual
                </span>
                <span className="bg-linear-to-r from-indigo-600 to-teal-600 bg-clip-text text-2xl font-bold tabular-nums text-transparent">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <Button
              size="lg"
              className="mt-6 h-auto w-full bg-linear-to-r from-indigo-600 to-teal-600 px-6 py-1.5 text-base text-white hover:from-indigo-700 hover:to-teal-700"
              render={
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Proceed to Booking
              <ArrowUpRight className="size-4" />
            </Button>
            <p className="mt-3 text-center text-xs text-gray-500">
              Opens the SRM student portal in a new tab.
            </p>
          </div>
        </aside>
      </div>

      <div className="grid gap-8 border-t border-gray-200 pt-10 md:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900">
            Warden Contact
          </h2>
          <div className="space-y-3 rounded-xl border-2 border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Users className="size-4 text-gray-400" />
              <span>{hostel.wardenName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="size-4 text-gray-400" />
              <a
                href={`tel:${hostel.wardenContact}`}
                className="text-gray-700 hover:text-indigo-600 hover:underline"
              >
                {hostel.wardenContact}
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="size-4 text-gray-400" />
              <a
                href={`mailto:${hostel.wardenEmail}`}
                className="break-all text-gray-700 hover:text-indigo-600 hover:underline"
              >
                {hostel.wardenEmail}
              </a>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900">
            Important Notes
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>· All prices are annual fees for the 2026–27 academic year.</li>
            <li>· Mess fee is mandatory and included in the total.</li>
            <li>· Laundry fee is optional and can be added at any time.</li>
            <li>
              · Booking is on a first-come, first-served basis through the SRM
              student portal.
            </li>
            {hostel.isOffCampus && (
              <li>· This is an off-campus hostel — plan transport accordingly.</li>
            )}
          </ul>
        </section>
      </div>
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
        'relative w-full rounded-lg border-2 p-4 text-left transition-all duration-200 md:p-5',
        selected
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
      )}
    >
      {isUrlMatch && (
        <span className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-medium text-indigo-600">
          Your selection
        </span>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold md:text-base">
            <span className="inline-flex items-center gap-1">
              {room.ac ? <Snowflake className="size-4" /> : null}
              {room.ac ? 'AC' : 'Non-AC'}
            </span>
            <span className={selected ? 'text-blue-400' : 'text-gray-400'}>
              ·
            </span>
            <span>
              {room.washroom === 'attached' ? 'Attached' : 'Common'} Washroom
            </span>
            <span className={selected ? 'text-blue-400' : 'text-gray-400'}>
              ·
            </span>
            <span>{room.sharing} Sharing</span>
          </div>
          {room.notes && (
            <p
              className={cn(
                'text-xs',
                selected ? 'text-blue-600/80' : 'text-gray-500'
              )}
            >
              {room.notes}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p
            className={cn(
              'text-base font-bold tabular-nums md:text-lg',
              selected ? 'text-blue-700' : 'text-gray-900'
            )}
          >
            ₹{room.price.toLocaleString('en-IN')}
          </p>
          <p
            className={cn(
              'text-xs',
              selected ? 'text-blue-600/80' : 'text-gray-500'
            )}
          >
            room only
          </p>
        </div>
      </div>
    </button>
  )
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
        <p className="text-sm text-gray-600">{label}</p>
        {sublabel && (
          <p className="bg-linear-to-r from-indigo-600 to-teal-600 bg-clip-text text-xs font-medium text-transparent">
            {sublabel}
          </p>
        )}
      </div>
      <span className="shrink-0 text-sm tabular-nums text-gray-700">
        ₹{value.toLocaleString('en-IN')}
      </span>
    </div>
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
