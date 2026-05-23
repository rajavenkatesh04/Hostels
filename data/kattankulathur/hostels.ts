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
    wardenName: 'Dr. Anandh S',
    wardenContact: '+91 7824055767',
    wardenEmail: 'warden.nblock.ktr@srmist.edu.in',
    messFees: BOYS_MESS_FEES,
    laundryFees: BOYS_LAUNDRY_FEES,
    coordinates: { lat: 12.820882831171065, lng: 80.04669320297067},
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
    wardenName: 'Dr. Manikandaprabhu',
    wardenContact: '+91 8056016639',
    wardenEmail: 'warden.gpb.ktr@srmist.edu.in',
    isOffCampus: true,
    messFees: 125000,
    laundryFees: BOYS_LAUNDRY_FEES,
    coordinates: { lat: 12.814531323805664, lng: 80.03770012313159},
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
    wardenName: 'Mr. A. R. Jenkins Roy',
    wardenContact: '+91 8056016614',
    wardenEmail: 'warden.adhiyaman.ktr@srmist.edu.in',
    messFees: BOYS_MESS_FEES,
    laundryFees: BOYS_LAUNDRY_FEES,
    coordinates: { lat: 12.821507981936358, lng: 80.04356801812088},
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
    wardenName: 'Mr. Vinoth Kumar G',
    wardenContact: '+91 8056016613',
    wardenEmail: 'warden.oorri.ktr@srmist.edu.in',
    messFees: BOYS_MESS_FEES,
    laundryFees: BOYS_LAUNDRY_FEES,
    coordinates: { lat: 12.821770667718747, lng: 80.04352640299375},
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
    wardenName: 'Dr. Boopathi D',
    wardenContact: '+91 8056016612',
    wardenEmail: 'warden.kaari.ktr@srmist.edu.in',
    messFees: BOYS_MESS_FEES,
    laundryFees: BOYS_LAUNDRY_FEES,
    coordinates: { lat: 12.822148678485568, lng: 80.04351107110479},
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
    wardenName: 'Dr. Saravanan Santhanam',
    wardenContact: '+91 7824055782',
    wardenEmail: 'warden.jains.ktr@srmist.edu.in',
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
    wardenName: 'Dr. Brindha A',
    wardenContact: '+91 8056016618',
    wardenEmail: 'warden.kalpananchawla.ktr@srmist.edu.in',
    messFees: GIRLS_MESS_FEES,
    laundryFees: GIRLS_LAUNDRY_FEES,
    coordinates: { lat: 12.820492634513078, lng: 80.04536791085057},
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
    wardenName: 'Dr. P. Muthamil Selvi',
    wardenContact: '+91 8056016617',
    wardenEmail: 'warden.meenakshi.ktr@srmist.edu.in',
    messFees: GIRLS_MESS_FEES,
    laundryFees: GIRLS_LAUNDRY_FEES,
    coordinates: { lat: 12.822186371757859, lng: 80.04237207076467},
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
    wardenName: 'Dr. Rajkohila A',
    wardenContact: '+91 8056016633',
    wardenEmail: 'warden.thamarai.ktr@srmist.edu.in',
    messFees: GIRLS_MESS_FEES,
    laundryFees: GIRLS_LAUNDRY_FEES,
    coordinates: { lat: 12.820498169977368, lng: 80.04448365140557},
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
    wardenName: 'Dr. Arun Kumar S',
    wardenContact: '+91 8056016632',
    wardenEmail: 'warden.mullai.ktr@srmist.edu.in',
    messFees: GIRLS_MESS_FEES,
    laundryFees: GIRLS_LAUNDRY_FEES,
    coordinates: { lat: 12.820462072184977, lng: 80.04413609588211},
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
    wardenName: 'Dr. Thenmalar S',
    wardenContact: '+91 8056016638',
    wardenEmail: 'warden.senbagam.ktr@srmist.edu.in',
    messFees: GIRLS_MESS_FEES,
    laundryFees: GIRLS_LAUNDRY_FEES,
    coordinates: { lat: 12.821055156548852, lng: 80.04453450765574},
  }),
]