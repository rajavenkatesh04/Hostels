import { Download, Eye, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { resources, type Resource } from '@/data/resources'

export const metadata = {
  title: 'Resources — SRM Hostels',
  description:
    'Download official SRM Kattankulathur hostel documents and circulars.',
}

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
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
          <ResourceCard key={r.id} resource={r} />
        ))}
      </div>
    </div>
  )
}

function ResourceCard({ resource }: { resource: Resource }) {
  const { title, description, url, isExternal } = resource
  // The `download` attribute only triggers a save dialog for same-origin
  // requests, so it's a no-op (or worse, ignored with a warning) on external URLs.
  const downloadAttr = isExternal ? undefined : ''

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="mb-2 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="size-5" />
        </div>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1" />
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          className="flex-1"
          render={
            <a href={url} target="_blank" rel="noopener noreferrer">
              <Eye className="size-4" />
              <span className="hidden sm:inline">View</span>
            </a>
          }
        />
        <Button
          variant="default"
          className="flex-1"
          render={
            <a
              href={url}
              download={downloadAttr}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="size-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
          }
        />
      </CardFooter>
    </Card>
  )
}
