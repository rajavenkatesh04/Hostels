import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import type { Hostel } from '@/types/hostel'
import { cn } from '@/lib/utils'

export function HostelGallery({ hostel }: { hostel: Hostel }) {
  const hasImages = hostel.images && hostel.images.length > 0

  if (!hasImages) {
    return (
      <section
        aria-label={`${hostel.name} photo gallery`}
        className="grid gap-2 sm:grid-cols-3"
      >
        <GalleryPlaceholder
          size="lg"
          className="aspect-[16/9] sm:col-span-2"
        />
        <div className="hidden sm:grid sm:grid-cols-2 sm:grid-rows-2 sm:gap-2">
          <GalleryPlaceholder size="sm" />
          <GalleryPlaceholder size="sm" />
          <GalleryPlaceholder size="sm" />
          <GalleryPlaceholder size="sm" />
        </div>
      </section>
    )
  }

  const images = hostel.images!
  return (
    <section
      aria-label={`${hostel.name} photo gallery`}
      className="grid gap-2 sm:grid-cols-3"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl sm:col-span-2">
        <Image
          src={images[0]}
          alt={`${hostel.name} primary photo`}
          fill
          sizes="(min-width: 640px) 66vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
      <div className="hidden sm:grid sm:grid-cols-2 sm:grid-rows-2 sm:gap-2">
        {images.slice(1, 5).map((src, i) => (
          <div key={src} className="relative overflow-hidden rounded-2xl">
            <Image
              src={src}
              alt={`${hostel.name} photo ${i + 2}`}
              fill
              sizes="(min-width: 640px) 17vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

function GalleryPlaceholder({
  size,
  className,
}: {
  size: 'lg' | 'sm'
  className?: string
}) {
  return (
    <div
      className={cn(
        'group flex items-center justify-center rounded-2xl border border-slate-200',
        'bg-gradient-to-br from-slate-50 to-slate-100',
        'transition-colors hover:bg-slate-200',
        className
      )}
    >
      <div className="flex flex-col items-center gap-1.5">
        <ImageIcon
          className={cn(
            'text-slate-300',
            size === 'lg' ? 'size-12' : 'size-8'
          )}
          aria-hidden
        />
        <span
          className={cn(
            'font-medium text-slate-400',
            size === 'lg' ? 'text-sm' : 'text-xs'
          )}
        >
          Coming soon
        </span>
      </div>
    </div>
  )
}
