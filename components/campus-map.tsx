'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Map,
  Marker,
  Popup,
  Source,
  Layer,
  NavigationControl,
} from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { GraduationCap, Navigation, CircleCheck, X } from 'lucide-react'
import type { Hostel } from '@/types/hostel'
import { kattankulathurHostels } from '@/data/kattankulathur/hostels'
import {
  KATTANKULATHUR_CENTER,
  UNIVERSITY_BUILDING_COORDS,
  UNIVERSITY_BUILDING_POLYGON,
} from '@/lib/campus-data'
import { getDirectionsUrl } from '@/lib/maps'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY
const UB_PURPLE = '#a855f7'

type Selected =
  | { type: 'hostel'; slug: string }
  | { type: 'ub' }
  | null

export function CampusMap() {
  const [selected, setSelected] = useState<Selected>(null)

  const ubPolygonGeoJson = useMemo(() => {
    const ring: [number, number][] = [
      ...UNIVERSITY_BUILDING_POLYGON.map<[number, number]>((p) => [p.lng, p.lat]),
      [UNIVERSITY_BUILDING_POLYGON[0].lng, UNIVERSITY_BUILDING_POLYGON[0].lat],
    ]
    return {
      type: 'Feature' as const,
      geometry: { type: 'Polygon' as const, coordinates: [ring] },
      properties: {},
    }
  }, [])

  if (!MAPTILER_KEY) return <MissingKeyFallback />

  const mapStyleUrl = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`

  const selectedHostel =
    selected?.type === 'hostel'
      ? kattankulathurHostels.find((h) => h.slug === selected.slug)
      : undefined

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl">
      <Map
        initialViewState={{
          latitude: KATTANKULATHUR_CENTER.lat,
          longitude: KATTANKULATHUR_CENTER.lng,
          zoom: 16,
        }}
        mapStyle={mapStyleUrl}
        dragRotate={false}
        touchZoomRotate={false}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        <Source id="ub-polygon" type="geojson" data={ubPolygonGeoJson}>
          <Layer
            id="ub-polygon-fill"
            type="fill"
            paint={{ 'fill-color': UB_PURPLE, 'fill-opacity': 0.2 }}
          />
          <Layer
            id="ub-polygon-outline"
            type="line"
            paint={{
              'line-color': UB_PURPLE,
              'line-width': 2,
              'line-opacity': 0.8,
            }}
          />
        </Source>

        <Marker
          longitude={UNIVERSITY_BUILDING_COORDS.lng}
          latitude={UNIVERSITY_BUILDING_COORDS.lat}
          anchor="center"
          onClick={(e) => {
            e.originalEvent.stopPropagation()
            setSelected({ type: 'ub' })
          }}
        >
          <UBMarkerDot />
        </Marker>

        {kattankulathurHostels.map((hostel) => {
          if (!hostel.coordinates) return null
          return (
            <Marker
              key={hostel.slug}
              longitude={hostel.coordinates.lng}
              latitude={hostel.coordinates.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                setSelected({ type: 'hostel', slug: hostel.slug })
              }}
            >
              <HostelMarkerDot
                gender={hostel.gender}
                isOffCampus={hostel.isOffCampus}
              />
            </Marker>
          )
        })}

        {selectedHostel?.coordinates && (
          <Popup
            longitude={selectedHostel.coordinates.lng}
            latitude={selectedHostel.coordinates.lat}
            anchor="bottom"
            offset={22}
            closeOnClick={false}
            closeButton={false}
            onClose={() => setSelected(null)}
            maxWidth="280px"
          >
            <HostelPopup
              hostel={selectedHostel}
              onClose={() => setSelected(null)}
            />
          </Popup>
        )}

        {selected?.type === 'ub' && (
          <Popup
            longitude={UNIVERSITY_BUILDING_COORDS.lng}
            latitude={UNIVERSITY_BUILDING_COORDS.lat}
            anchor="bottom"
            offset={26}
            closeOnClick={false}
            closeButton={false}
            onClose={() => setSelected(null)}
            maxWidth="300px"
          >
            <UBPopup onClose={() => setSelected(null)} />
          </Popup>
        )}
      </Map>
    </div>
  )
}

type HostelMarkerDotProps = {
  gender: 'boys' | 'girls'
  isOffCampus?: boolean
}

function HostelMarkerDot({ gender, isOffCampus }: HostelMarkerDotProps) {
  const colorClass = gender === 'boys' ? 'bg-indigo-600' : 'bg-pink-500'

  return (
    <div className="group relative cursor-pointer">
      <div
        className={`h-8 w-8 rounded-full border-[2.5px] border-white shadow-md transition-transform duration-150 ease-out group-hover:scale-110 ${colorClass}`}
      />
      {isOffCampus && (
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-amber-400" />
      )}
    </div>
  )
}

function UBMarkerDot() {
  return (
    <div className="group cursor-pointer">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-white shadow-lg transition-transform duration-150 ease-out group-hover:scale-110"
        style={{ backgroundColor: UB_PURPLE }}
      >
        <GraduationCap className="h-5 w-5 text-white" strokeWidth={2.25} />
      </div>
    </div>
  )
}

function HostelPopup({
  hostel,
  onClose,
}: {
  hostel: Hostel
  onClose: () => void
}) {
  const isBoys = hostel.gender === 'boys'
  const distanceLabel = hostel.distanceToUB
    ? hostel.distanceToUB.meters < 1000
      ? `${hostel.distanceToUB.meters}m to University Building`
      : `${(hostel.distanceToUB.meters / 1000).toFixed(1)}km to University Building`
    : null

  return (
    <div className="relative flex flex-col gap-3 p-4">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="pr-6">
        <h3 className="text-lg font-semibold text-slate-900">{hostel.name}</h3>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge
          className={
            isBoys
              ? 'bg-indigo-50 text-indigo-700'
              : 'bg-pink-50 text-pink-700'
          }
        >
          {isBoys ? 'Boys Hostel' : 'Girls Hostel'}
        </Badge>
        {hostel.isOffCampus && (
          <Badge className="bg-amber-50 text-amber-700">Off-campus</Badge>
        )}
      </div>

      {distanceLabel && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <GraduationCap
            className="h-4 w-4 shrink-0"
            style={{ color: UB_PURPLE }}
          />
          <span>{distanceLabel}</span>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          className="flex-1"
          render={<Link href={`/hostels/${hostel.slug}`} />}
        >
          Learn More
        </Button>
        {hostel.coordinates && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
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
            <Navigation />
            Navigate
          </Button>
        )}
      </div>
    </div>
  )
}

function UBPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative flex flex-col gap-3 p-4">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="flex flex-col gap-1 pr-6">
        <Badge className="self-start bg-purple-50 text-purple-700">
          Academic Building
        </Badge>
        <h3 className="text-lg font-semibold text-slate-900">
          University Building
        </h3>
      </div>

      <ul className="flex flex-col gap-1.5 text-sm text-slate-700">
        {[
          '1st year classes happen here',
          'Admission office (2nd floor)',
          'Central library',
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="rounded-lg bg-purple-50 p-3 text-xs leading-relaxed text-purple-800">
        All first year classes are conducted in this building. Check the
        distance from your hostel by clicking on the hostel markers.
      </div>

      <Button
        size="sm"
        render={
          <a
            href={getDirectionsUrl(
              UNIVERSITY_BUILDING_COORDS.lat,
              UNIVERSITY_BUILDING_COORDS.lng
            )}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <Navigation />
        Navigate to Building
      </Button>
    </div>
  )
}

function MissingKeyFallback() {
  return (
    <div className="flex h-full w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Hostels near University Building
        </h3>
        <p className="text-xs text-slate-500">
          Map unavailable — showing list view.
        </p>
      </div>
      <ul className="space-y-2 overflow-auto">
        {kattankulathurHostels.map((hostel) => (
          <li
            key={hostel.slug}
            className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <div className="flex flex-col">
              <span className="font-medium text-slate-900">{hostel.name}</span>
              <span className="text-xs text-slate-500 capitalize">
                {hostel.gender} hostel
                {hostel.isOffCampus ? ' · off-campus' : ''}
              </span>
            </div>
            {hostel.distanceToUB && (
              <span className="text-xs text-slate-600">
                {hostel.distanceToUB.meters < 1000
                  ? `${hostel.distanceToUB.meters} m`
                  : `${(hostel.distanceToUB.meters / 1000).toFixed(1)} km`}{' '}
                to UB
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
