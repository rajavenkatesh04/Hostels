import type { Hostel } from '@/types/hostel'
import {
  UNIVERSITY_BUILDING_COORDS,
  calculateHaversineDistance,
  metersToWalkingMinutes,
} from '@/lib/campus-data'

const BOYS_MESS_FEES = 73000
const BOYS_LAUNDRY_FEES = 7500
const GIRLS_MESS_FEES = 73000
const GIRLS_LAUNDRY_FEES = 8500

function withDistance(hostel: Hostel): Hostel {
  if (!hostel.coordinates) return hostel
  const meters = Math.round(
    calculateHaversineDistance(hostel.coordinates, UNIVERSITY_BUILDING_COORDS)
  )
  return {
    ...hostel,
    distanceToUB: {
      meters,
      walkingMinutes: metersToWalkingMinutes(meters),
    },
  }
}

export const kattankulathurHostels: Hostel[] = [
  withDistance({
    slug: 'n-block',
    name: 'N Block',
    description:
      'On-campus boys hostel with premium AC rooms and attached washrooms, ideal for students seeking comfort close to academic blocks.',
    branch: 'kattankulathur',
    gender: 'boys',
    year: 1,
    rooms: [
      { sharing: 2, ac: true, washroom: 'attached', price: 200000 },
      { sharing: 3, ac: true, washroom: 'attached', price: 180000 },
    ],
    wardenName: 'TBD',
    wardenContact: 'TBD',
    wardenEmail: 'TBD',
    messFees: BOYS_MESS_FEES,
    laundryFees: BOYS_LAUNDRY_FEES,
    coordinates: { lat: 12.824, lng: 80.0438 },
  }),
  withDistance({
    slug: 'green-pearl',
    name: 'Green Pearl',
    description:
      'Off-campus boys hostel with AC and Non-AC attached-washroom rooms. Mess fees here are higher than the on-campus standard.',
    branch: 'kattankulathur',
    gender: 'boys',
    year: 1,
    rooms: [
      { sharing: 3, ac: true, washroom: 'attached', price: 145000 },
      { sharing: 3, ac: false, washroom: 'attached', price: 65000 },
    ],
    wardenName: 'TBD',
    wardenContact: 'TBD',
    wardenEmail: 'TBD',
    isOffCampus: true,
    messFees: 125000,
    laundryFees: BOYS_LAUNDRY_FEES,
    coordinates: { lat: 12.8195, lng: 80.042 },
  }),
  withDistance({
    slug: 'adhiyaman',
    name: 'Adhiyaman',
    description:
      'On-campus boys hostel offering a wide range of AC and Non-AC room configurations, all with attached washrooms.',
    branch: 'kattankulathur',
    gender: 'boys',
    year: 1,
    rooms: [
      { sharing: 2, ac: true, washroom: 'attached', price: 170000 },
      { sharing: 3, ac: true, washroom: 'attached', price: 160000 },
      { sharing: 4, ac: true, washroom: 'attached', price: 150000 },
      { sharing: 3, ac: false, washroom: 'attached', price: 80000 },
    ],
    wardenName: 'TBD',
    wardenContact: 'TBD',
    wardenEmail: 'TBD',
    messFees: BOYS_MESS_FEES,
    laundryFees: BOYS_LAUNDRY_FEES,
    coordinates: { lat: 12.8222, lng: 80.0452 },
  }),
  withDistance({
    slug: 'oori',
    name: 'Oori',
    description:
      'On-campus boys hostel with air-conditioned rooms and common washrooms. Available in 4 and 5 sharing configurations at the same price.',
    branch: 'kattankulathur',
    gender: 'boys',
    year: 1,
    rooms: [
      { sharing: 4, ac: true, washroom: 'common', price: 115000 },
      { sharing: 5, ac: true, washroom: 'common', price: 115000 },
    ],
    wardenName: 'TBD',
    wardenContact: 'TBD',
    wardenEmail: 'TBD',
    messFees: BOYS_MESS_FEES,
    laundryFees: BOYS_LAUNDRY_FEES,
    coordinates: { lat: 12.8218, lng: 80.0438 },
  }),
  withDistance({
    slug: 'kaari',
    name: 'Kaari',
    description:
      'On-campus boys hostel with budget-friendly Non-AC rooms and common washrooms. Available in 4 and 5 sharing configurations.',
    branch: 'kattankulathur',
    gender: 'boys',
    year: 1,
    rooms: [
      { sharing: 4, ac: false, washroom: 'common', price: 45000 },
      { sharing: 5, ac: false, washroom: 'common', price: 45000 },
    ],
    wardenName: 'TBD',
    wardenContact: 'TBD',
    wardenEmail: 'TBD',
    messFees: BOYS_MESS_FEES,
    laundryFees: BOYS_LAUNDRY_FEES,
    coordinates: { lat: 12.8215, lng: 80.0442 },
  }),
  withDistance({
    slug: 'ja-block-2',
    name: 'JA Block 2',
    description:
      'Off-campus boys hostel offering the most affordable option, with Non-AC 7-sharing rooms and attached washrooms.',
    branch: 'kattankulathur',
    gender: 'boys',
    year: 1,
    rooms: [{ sharing: 7, ac: false, washroom: 'attached', price: 37000 }],
    wardenName: 'TBD',
    wardenContact: 'TBD',
    wardenEmail: 'TBD',
    isOffCampus: true,
    messFees: BOYS_MESS_FEES,
    laundryFees: BOYS_LAUNDRY_FEES,
    coordinates: { lat: 12.818, lng: 80.048 },
  }),
  withDistance({
    slug: 'kalpana-chawla',
    name: 'Kalpana Chawla',
    description:
      'On-campus girls hostel with premium AC rooms and attached washrooms, available in 2 and 4 sharing configurations.',
    branch: 'kattankulathur',
    gender: 'girls',
    year: 1,
    rooms: [
      { sharing: 2, ac: true, washroom: 'attached', price: 197000 },
      { sharing: 4, ac: true, washroom: 'attached', price: 150000 },
    ],
    wardenName: 'TBD',
    wardenContact: 'TBD',
    wardenEmail: 'TBD',
    messFees: GIRLS_MESS_FEES,
    laundryFees: GIRLS_LAUNDRY_FEES,
    coordinates: { lat: 12.8245, lng: 80.0452 },
  }),
  withDistance({
    slug: 'meenakshi',
    name: 'Meenakshi',
    description:
      'On-campus girls hostel with AC and Non-AC rooms and attached washrooms. The 4-sharing AC option uses bunker cots.',
    branch: 'kattankulathur',
    gender: 'girls',
    year: 1,
    rooms: [
      {
        sharing: 4,
        ac: true,
        washroom: 'attached',
        price: 140000,
        notes: 'Bunker cot',
      },
      { sharing: 3, ac: false, washroom: 'attached', price: 80000 },
    ],
    wardenName: 'TBD',
    wardenContact: 'TBD',
    wardenEmail: 'TBD',
    messFees: GIRLS_MESS_FEES,
    laundryFees: GIRLS_LAUNDRY_FEES,
    coordinates: { lat: 12.8242, lng: 80.046 },
  }),
  withDistance({
    slug: 'thamarai',
    name: 'Thamarai',
    description:
      'On-campus girls hostel with Non-AC 2-sharing rooms and common washrooms.',
    branch: 'kattankulathur',
    gender: 'girls',
    year: 1,
    rooms: [{ sharing: 2, ac: false, washroom: 'common', price: 60000 }],
    wardenName: 'TBD',
    wardenContact: 'TBD',
    wardenEmail: 'TBD',
    messFees: GIRLS_MESS_FEES,
    laundryFees: GIRLS_LAUNDRY_FEES,
    coordinates: { lat: 12.8238, lng: 80.0428 },
  }),
  withDistance({
    slug: 'mullai',
    name: 'Mullai',
    description:
      'On-campus girls hostel with Non-AC 3-sharing rooms and common washrooms.',
    branch: 'kattankulathur',
    gender: 'girls',
    year: 1,
    rooms: [{ sharing: 3, ac: false, washroom: 'common', price: 50000 }],
    wardenName: 'TBD',
    wardenContact: 'TBD',
    wardenEmail: 'TBD',
    messFees: GIRLS_MESS_FEES,
    laundryFees: GIRLS_LAUNDRY_FEES,
    coordinates: { lat: 12.8236, lng: 80.0432 },
  }),
  withDistance({
    slug: 'senbagam',
    name: 'Senbagam',
    description:
      'On-campus girls hostel with budget-friendly Non-AC 6-sharing rooms and common washrooms.',
    branch: 'kattankulathur',
    gender: 'girls',
    year: 1,
    rooms: [{ sharing: 6, ac: false, washroom: 'common', price: 45000 }],
    wardenName: 'TBD',
    wardenContact: 'TBD',
    wardenEmail: 'TBD',
    messFees: GIRLS_MESS_FEES,
    laundryFees: GIRLS_LAUNDRY_FEES,
    coordinates: { lat: 12.8233, lng: 80.0425 },
  }),
]
