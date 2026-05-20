import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import type { Hostel, WashroomType } from '@/types/hostel'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg">{hostel.name}</CardTitle>
          <Badge variant={isBoys ? 'default' : 'secondary'}>
            {isBoys ? 'Boys' : 'Girls'}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {hostel.isOffCampus ? 'Off-campus' : 'On-campus'}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            {hostel.rooms.length} room{hostel.rooms.length === 1 ? '' : ' types'}
          </span>
        </div>
        <CardDescription className="line-clamp-3 pt-2">
          {hostel.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Starting at
        </p>
        <p className="mt-1">
          <span className="text-2xl font-bold tracking-tight">
            ₹{startingPrice.toLocaleString('en-IN')}
          </span>
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            / year
          </span>
        </p>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          render={<Link href={buildDetailHref(hostel.slug, forwardParams)} />}
        >
          View Details
          <ArrowRight className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
