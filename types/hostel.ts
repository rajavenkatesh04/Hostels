export type Branch = 'kattankulathur'
export type Gender = 'boys' | 'girls'
export type Year = 1 | 2 | 3 | 4
export type WashroomType = 'attached' | 'common'

export type Room = {
  sharing: number
  ac: boolean
  washroom: WashroomType
  price: number
  notes?: string
}

export type Hostel = {
  slug: string
  name: string
  description: string
  branch: Branch
  gender: Gender
  year: Year
  rooms: Room[]
  wardenName: string
  wardenContact: string
  wardenEmail: string
  isOffCampus?: boolean
  messFees: number
  laundryFees: number
  imageUrl?: string
  images?: string[]
  floorPlanUrl?: string
  placeId?: string
  coordinates?: {
    lat: number
    lng: number
  }
  distanceToUB?: {
    meters: number
    walkingMinutes: number
  }
}

export type HostelFilter = {
  branch?: Branch
  gender?: Gender
  year?: Year
  ac?: boolean
  washroom?: WashroomType
  sharing?: number
}