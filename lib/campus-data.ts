export const UNIVERSITY_BUILDING_COORDS = {
  lat: 12.823,
  lng: 80.0444,
} as const

export const UNIVERSITY_BUILDING_POLYGON: { lat: number; lng: number }[] = [
  { lat: 12.8233, lng: 80.0441 },
  { lat: 12.8233, lng: 80.0447 },
  { lat: 12.8231, lng: 80.0449 },
  { lat: 12.8227, lng: 80.0447 },
  { lat: 12.8227, lng: 80.0441 },
  { lat: 12.8229, lng: 80.0439 },
]

export const KATTANKULATHUR_CENTER = {
  lat: 12.8225,
  lng: 80.0444,
} as const

type LatLng = { lat: number; lng: number }

const EARTH_RADIUS_METERS = 6_371_000
const toRadians = (deg: number) => (deg * Math.PI) / 180

export function calculateHaversineDistance(a: LatLng, b: LatLng): number {
  const dLat = toRadians(b.lat - a.lat)
  const dLng = toRadians(b.lng - a.lng)
  const lat1 = toRadians(a.lat)
  const lat2 = toRadians(b.lat)

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return EARTH_RADIUS_METERS * c
}

export function metersToWalkingMinutes(meters: number): number {
  return Math.ceil(meters / 80)
}
