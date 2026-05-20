import type { Branch, Hostel, HostelFilter } from '@/types/hostel'
import { kattankulathurHostels } from '@/data/kattankulathur/hostels'

const allHostels: Hostel[] = [...kattankulathurHostels]

export async function getAllHostels(): Promise<Hostel[]> {
  return allHostels
}

export async function getHostelBySlug(slug: string): Promise<Hostel | undefined> {
  return allHostels.find((h) => h.slug === slug)
}

export async function getHostelsByBranch(branch: Branch): Promise<Hostel[]> {
  return allHostels.filter((h) => h.branch === branch)
}

export async function filterHostels(filter: HostelFilter): Promise<Hostel[]> {
  return allHostels.filter((hostel) => {
    if (filter.branch && hostel.branch !== filter.branch) return false
    if (filter.gender && hostel.gender !== filter.gender) return false
    if (filter.year && hostel.year !== filter.year) return false

    const roomFilters = {
      ac: filter.ac,
      washroom: filter.washroom,
      sharing: filter.sharing,
    }
    const hasRoomFilter =
      roomFilters.ac !== undefined ||
      roomFilters.washroom !== undefined ||
      roomFilters.sharing !== undefined

    if (!hasRoomFilter) return true

    return hostel.rooms.some((room) => {
      if (roomFilters.ac !== undefined && room.ac !== roomFilters.ac) return false
      if (roomFilters.washroom !== undefined && room.washroom !== roomFilters.washroom) return false
      if (roomFilters.sharing !== undefined && room.sharing !== roomFilters.sharing) return false
      return true
    })
  })
}
