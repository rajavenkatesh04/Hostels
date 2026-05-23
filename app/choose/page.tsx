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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Suspense fallback={null}>
        <Picker hostels={hostels} />
      </Suspense>
    </div>
  )
}
