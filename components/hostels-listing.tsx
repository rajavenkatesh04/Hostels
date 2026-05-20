'use client'

import { useQueryState, parseAsStringLiteral } from 'nuqs'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HostelCard } from '@/components/hostel-card'
import type { Hostel } from '@/types/hostel'

const tabParser = parseAsStringLiteral([
  'all',
  'boys',
  'girls',
] as const).withDefault('all')

export function HostelsListing({ hostels }: { hostels: Hostel[] }) {
  const [tab, setTab] = useQueryState('tab', tabParser)

  const filtered =
    tab === 'all' ? hostels : hostels.filter((h) => h.gender === tab)

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">All Hostels</TabsTrigger>
          <TabsTrigger value="boys">Boys Hostels</TabsTrigger>
          <TabsTrigger value="girls">Girls Hostels</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No hostels in this category.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((hostel) => (
            <HostelCard key={hostel.slug} hostel={hostel} />
          ))}
        </div>
      )}
    </div>
  )
}
