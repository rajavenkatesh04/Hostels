import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import type { Hostel, WashroomType } from '@/types/hostel'
import { Button } from '@/components/ui/button'

export type ForwardParams = {
  ac?: boolean | null
  washroom?: WashroomType | null
  sharing?: number | null
}

function buildDetailHref(slug: string, params?: ForwardParams) {
  if (!params) return `/hostels/${slug}`
  const search = new URLSearchParams()
  if (params.ac !== null && params.ac !== undefined) {
    search.set('ac', String(params.ac))
  }
  if (params.washroom) search.set('washroom', params.washroom)
  if (params.sharing !== null && params.sharing !== undefined) {
    search.set('sharing', String(params.sharing))
  }
  const qs = search.toString()
  return qs ? `/hostels/${slug}?${qs}` : `/hostels/${slug}`
}

export function HostelCard({
  hostel,
  forwardParams,
}: {
  hostel: Hostel
  forwardParams?: ForwardParams
}) {
  const minRoomPrice = Math.min(...hostel.rooms.map((r) => r.price))
  const startingPrice = minRoomPrice + hostel.messFees
  const isBoys = hostel.gender === 'boys'

  return (
    <div className="group flex h-full flex-col rounded-xl border-2 border-gray-200 bg-gray-50 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-3xl font-semibold tracking-tight text-gray-900">
          {hostel.name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            isBoys
              ? 'bg-blue-50 text-blue-700'
              : 'bg-pink-50 text-pink-700'
          }`}
        >
          {isBoys ? 'Boys' : 'Girls'}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3" />
          {hostel.isOffCampus ? 'Off-campus' : 'On-campus'}
        </span>
        <span>·</span>
        <span>
          {hostel.rooms.length} room{hostel.rooms.length === 1 ? '' : ' types'}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-gray-600">
        {hostel.description}
      </p>

      <div className="mt-6 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Starting at
        </p>
        <p className="mt-1">
          <span className="bg-linear-to-r from-indigo-600 to-teal-600 bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
            ₹{startingPrice.toLocaleString('en-IN')}
          </span>
          <span className="ml-1 text-sm font-normal text-gray-500">
            / year
          </span>
        </p>
      </div>

      <div className="mt-6">
        <Button
          size="lg"
          className="h-auto w-full px-6 py-2.5 bg-gray-700 "
          render={<Link href={buildDetailHref(hostel.slug, forwardParams)} />}
        >
          View Details
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
