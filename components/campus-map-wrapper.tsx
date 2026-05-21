'use client'

import dynamic from 'next/dynamic'

const CampusMap = dynamic(
  () => import('./campus-map').then((mod) => mod.CampusMap),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
)

function MapSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading campus map"
      className="h-full w-full animate-pulse rounded-2xl bg-slate-100"
    />
  )
}

export function CampusMapWrapper() {
  return <CampusMap />
}
