import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllHostels, getHostelBySlug } from '@/lib/hostels'
import { HostelDetail } from '@/components/hostel-detail'
import { HostelGallery } from '@/components/hostel-gallery'

export const dynamicParams = false

export async function generateStaticParams() {
  const hostels = await getAllHostels()
  return hostels.map((h) => ({ slug: h.slug }))
}

export async function generateMetadata(
  props: PageProps<'/hostels/[slug]'>
): Promise<Metadata> {
  const { slug } = await props.params
  const hostel = await getHostelBySlug(slug)
  if (!hostel) return { title: 'Hostel not found' }
  return {
    title: `${hostel.name} — SRM Kattankulathur Hostels`,
    description: hostel.description,
  }
}

export default async function HostelDetailPage(
  props: PageProps<'/hostels/[slug]'>
) {
  const { slug } = await props.params
  const hostel = await getHostelBySlug(slug)
  if (!hostel) notFound()

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
        <Suspense fallback={null}>
          <HostelDetail hostel={hostel} />
        </Suspense>
        <HostelGallery hostel={hostel} />
      </div>
    </div>
  )
}
