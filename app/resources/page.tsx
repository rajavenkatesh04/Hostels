import Link from 'next/link'
import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const resources = [
  {
    title: 'Hostel Fees Circular 2026–27',
    description:
      'Official SRMIST circular with the complete hostel fee structure for all first-year B.Tech and M.Tech (Integrated) students at Kattankulathur.',
    href: '/resources/circular-2026-27.pdf',
    filename: 'circular-2026-27.pdf',
  },
] as const

export const metadata = {
  title: 'Resources — SRM Hostels',
  description:
    'Download official SRM Kattankulathur hostel documents and circulars.',
}

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Resources
        </h1>
        <p className="text-muted-foreground">
          Official documents and downloads.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {resources.map((r) => (
          <Card key={r.href} className="flex h-full flex-col">
            <CardHeader>
              <div className="mb-2 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <CardTitle>{r.title}</CardTitle>
              <CardDescription>{r.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1" />
            <CardFooter>
              <Button
                className="w-full"
                render={
                  <Link href={r.href} download={r.filename} target="_blank">
                    <Download className="size-4" />
                    Download PDF
                  </Link>
                }
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
