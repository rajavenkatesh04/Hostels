import { Suspense } from 'react'
import { getAllHostels } from '@/lib/hostels'
import { HostelsListing } from '@/components/hostels-listing'

export const metadata = {
  title: 'All Hostels — SRM Kattankulathur',
  description:
    'Browse all 2026-27 hostels at SRM Kattankulathur. Filter by boys or girls and compare room configurations.',
}

export default async function HostelsPage() {
  const hostels = await getAllHostels()
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <header className="space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          All Hostels
        </h1>
        <p className="text-muted-foreground">
          {hostels.length} hostels at SRM Kattankulathur for 2026–27.
        </p>
      </header>
      <Suspense fallback={null}>
        <HostelsListing hostels={hostels} />
      </Suspense>
    </div>
  )
}
