'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ArrowUpRight,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Snowflake,
  Users,
} from 'lucide-react'
import type { Hostel, Room, WashroomType } from '@/types/hostel'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

const BOOKING_URL = 'https://sp.srmist.edu.in/srmiststudentportal'

const yearLabels: Record<number, string> = {
  1: '1st Year',
  2: '2nd Year',
  3: '3rd Year',
  4: '4th Year',
}

function findInitialRoomIndex(
  hostel: Hostel,
  searchParams: URLSearchParams
) {
  const acStr = searchParams.get('ac')
  const washroomStr = searchParams.get('washroom')
  const sharingStr = searchParams.get('sharing')

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
  return idx >= 0 ? idx : 0
}

export function HostelDetail({ hostel }: { hostel: Hostel }) {
  const searchParams = useSearchParams()
  const initialIndex = useMemo(
    () => findInitialRoomIndex(hostel, new URLSearchParams(searchParams.toString())),
    [hostel, searchParams]
  )
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(initialIndex)
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
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={isBoys ? 'default' : 'secondary'}>
                {isBoys ? 'Boys' : 'Girls'}
              </Badge>
              <Badge variant="outline">
                <MapPin className="size-3" />
                {hostel.isOffCampus ? 'Off-campus' : 'On-campus'}
              </Badge>
              <Badge variant="outline">
                <GraduationCap className="size-3" />
                {yearLabels[hostel.year] ?? `Year ${hostel.year}`}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {hostel.name}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {hostel.description}
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">
              Available Room Types
            </h2>
            <p className="text-sm text-muted-foreground">
              Select a room type to update the pricing summary.
            </p>
            <div className="space-y-2 pt-1">
              {hostel.rooms.map((room, index) => (
                <RoomOption
                  key={`${room.ac}-${room.washroom}-${room.sharing}-${index}`}
                  room={room}
                  selected={selectedRoomIndex === index}
                  onSelect={() => setSelectedRoomIndex(index)}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <PriceRow
                  label="Selected room"
                  value={selectedRoom.price}
                  sublabel={describeRoom(selectedRoom)}
                />
                <PriceRow label="Mess fee (mandatory)" value={hostel.messFees} />
                <div className="flex items-start justify-between gap-3 py-1">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <Switch
                      checked={laundryEnabled}
                      onCheckedChange={setLaundryEnabled}
                      className="mt-0.5"
                    />
                    <span className="text-muted-foreground text-sm leading-tight">
                      Laundry
                      <span className="block text-xs">(optional)</span>
                    </span>
                  </label>
                  <span
                    className={cn(
                      'text-sm tabular-nums',
                      !laundryEnabled && 'text-muted-foreground line-through'
                    )}
                  >
                    ₹{hostel.laundryFees.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-border pt-3">
                  <span className="font-semibold">Total annual</span>
                  <span className="text-xl font-bold tabular-nums">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
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
              <p className="text-xs text-muted-foreground text-center">
                Opens the SRM student portal in a new tab.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      <div className="grid gap-8 border-t border-border pt-10 md:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Warden Contact
          </h2>
          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Users className="size-4 text-muted-foreground" />
                <span>{hostel.wardenName}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                <a
                  href={`tel:${hostel.wardenContact}`}
                  className="text-slate-700 hover:text-indigo-600 hover:underline"
                >
                  {hostel.wardenContact}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                <a
                  href={`mailto:${hostel.wardenEmail}`}
                  className="break-all text-slate-700 hover:text-indigo-600 hover:underline"
                >
                  {hostel.wardenEmail}
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Important Notes
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
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
  onSelect,
}: {
  room: Room
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'w-full rounded-lg border p-4 text-left transition-all',
        selected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-border bg-background hover:bg-muted/50'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium">
            <span className="inline-flex items-center gap-1">
              {room.ac ? (
                <Snowflake className="size-3.5 text-muted-foreground" />
              ) : null}
              {room.ac ? 'AC' : 'Non-AC'}
            </span>
            <span className="text-muted-foreground">·</span>
            <span>
              {room.washroom === 'attached' ? 'Attached' : 'Common'} Washroom
            </span>
            <span className="text-muted-foreground">·</span>
            <span>{room.sharing} Sharing</span>
          </div>
          {room.notes && (
            <p className="text-xs text-muted-foreground">{room.notes}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-base font-semibold tabular-nums">
            ₹{room.price.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-muted-foreground">room only</p>
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
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        {sublabel && <p className="text-xs text-muted-foreground/80">{sublabel}</p>}
      </div>
      <span className="text-sm tabular-nums">
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
