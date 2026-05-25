import { Download, Eye, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { resources, type Resource } from '@/data/resources'

export const metadata = {
    title: 'Resources — SRM Hostels',
    description:
        'Download official SRM Kattankulathur hostel documents and circulars.',
}

export default function ResourcesPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
            {/* Masthead */}
            <header className="space-y-5 border-b border-stone-300 pb-10">
                {/*<div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs uppercase tracking-[0.18em] text-stone-500">*/}
                {/*    <span className="text-[#0c4da2]">Resources</span>*/}
                {/*    <span className="text-stone-300">/</span>*/}
                {/*    <span>Official Documents</span>*/}
                {/*    <span className="text-stone-300">/</span>*/}
                {/*    <span>{resources.length} {resources.length === 1 ? 'File' : 'Files'}</span>*/}
                {/*</div>*/}
                <h1 className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
                    Resources
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-stone-700">
                    Circulars, rule books, and reference material — all sourced directly
                    from official SRM channels.
                </p>
            </header>

            {/* Resource grid */}
            <section className="space-y-6">
                <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs tracking-[0.2em] text-[#0c4da2]">
            01
          </span>
                    <h2 className="font-display text-2xl font-medium tracking-tight text-stone-900 md:text-[1.75rem]">
                        Files
                        <span className="ml-2 text-stone-400">({resources.length})</span>
                    </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    {resources.map((r) => (
                        <ResourceCard key={r.id} resource={r} />
                    ))}
                </div>
            </section>
        </div>
    )
}

function ResourceCard({ resource }: { resource: Resource }) {
    const { title, description, url, isExternal } = resource
    // The `download` attribute only triggers a save dialog for same-origin
    // requests, so it's a no-op (or worse, ignored with a warning) on external URLs.
    const downloadAttr = isExternal ? undefined : ''

    return (
        <article className="group flex h-full flex-col rounded-sm border-2 border-stone-200 bg-white p-6 transition-all duration-200 hover:border-[#0c4da2] hover:shadow-[0_0_0_4px_rgba(12,77,162,0.08)]">
            {/* Kicker + icon row */}
            <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
          PDF Document
        </span>
                <span
                    aria-hidden
                    className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-stone-200 bg-stone-50 text-stone-500 transition-colors group-hover:border-[#0c4da2]/30 group-hover:bg-[#0c4da2]/[0.06] group-hover:text-[#0c4da2]"
                >
          <FileText className="size-5" strokeWidth={1.5} />
        </span>
            </div>

            {/* Title + description */}
            <h3 className="mt-4 font-display text-xl font-medium leading-snug tracking-tight text-stone-900 transition-colors group-hover:text-[#0c4da2] md:text-[1.375rem]">
                {title}
            </h3>
            {description && (
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {description}
                </p>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Actions */}
            <div className="mt-6 flex gap-2 border-t border-stone-200 pt-4">
                <Button
                    variant="outline"
                    className="flex-1 rounded-sm border-2 border-stone-300 bg-transparent text-sm font-medium text-stone-700 hover:border-[#0c4da2] hover:bg-stone-50 hover:text-[#0c4da2]"
                    render={
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            <Eye className="size-4" />
                            <span className="hidden sm:inline">View</span>
                        </a>
                    }
                />
                <Button
                    className="flex-1 rounded-sm bg-[#0c4da2] text-sm font-medium tracking-wide text-white hover:bg-[#093d82]"
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
            </div>
        </article>
    )
}