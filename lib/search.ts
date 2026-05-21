import Fuse from 'fuse.js'
import type { Hostel } from '@/types/hostel'
import { kattankulathurHostels } from '@/data/kattankulathur/hostels'

export type SearchableHostel = Hostel & {
  searchableTags: string[]
}

function buildTags(hostel: Hostel): string[] {
  const tags: string[] = []

  if (hostel.rooms.some((r) => r.ac === true)) tags.push('AC')
  if (hostel.rooms.some((r) => r.ac === false)) tags.push('Non-AC')

  if (hostel.rooms.some((r) => r.washroom === 'attached')) tags.push('Attached Washroom')
  if (hostel.rooms.some((r) => r.washroom === 'common')) tags.push('Common Washroom')

  if (hostel.isOffCampus) tags.push('Off Campus')

  tags.push(hostel.gender === 'boys' ? 'Boys' : 'Girls')

  const sharings = hostel.rooms.map((r) => r.sharing)
  const min = Math.min(...sharings)
  const max = Math.max(...sharings)
  tags.push(min === max ? `${min} Sharing` : `${min}-${max} Sharing`)

  return tags
}

export function getSearchableHostels(): SearchableHostel[] {
  return kattankulathurHostels.map((h) => ({ ...h, searchableTags: buildTags(h) }))
}

export function createSearchInstance(hostels: SearchableHostel[]): Fuse<SearchableHostel> {
  return new Fuse(hostels, {
    keys: [
      { name: 'name', weight: 3 },
      { name: 'searchableTags', weight: 2 },
      { name: 'gender', weight: 1 },
      { name: 'description', weight: 1 },
    ],
    threshold: 0.3,
    includeScore: true,
  })
}
