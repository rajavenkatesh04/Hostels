export const UNIVERSITY_BUILDING_COORDS = {
  lat: 12.8234939,
  lng: 80.0423590,
} as const

export const UNIVERSITY_BUILDING_POLYGON: { lat: number; lng: number }[] = [
  { lat: 12.8237535, lng: 80.0426184 },
  { lat: 12.823748, lng: 80.0423692 },
  { lat: 12.8235768, lng: 80.0420803 },
  { lat: 12.8232453, lng: 80.0420293 },
  { lat: 12.8231459, lng: 80.0426977 },
]

export const KATTANKULATHUR_CENTER = {
  lat: 12.8222,  // a bit south of UB so hostels are visible
  lng: 80.0425,
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
