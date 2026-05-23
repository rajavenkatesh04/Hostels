import { Suspense } from 'react'
import { getAllHostels } from '@/lib/hostels'
import { Picker } from '@/components/picker/picker'

export const metadata = {
  title: 'Choose your hostel — SRM Kattankulathur',
  description:
    'Use the guided picker to find the SRM Kattankulathur hostel that fits your gender, year, room type, and budget.',
}

export default async function ChoosePage() {
  const hostels = await getAllHostels()
  return (
    <Suspense fallback={null}>
      <Picker hostels={hostels} />
    </Suspense>
  )
}
