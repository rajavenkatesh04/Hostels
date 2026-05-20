import Link from 'next/link'
import { FAQAccordion } from '@/components/faq-accordion'

const previewPills = [
  'Boys',
  'Girls',
  '1st Year',
  'AC',
  'Non-AC',
  'Attached Washroom',
  'Common Washroom',
  '2 Sharing',
  '3 Sharing',
  '4 Sharing',
]

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-teal-500 px-6 py-16 sm:px-12 sm:py-24 lg:py-28 text-white shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_55%)]" />
        <div className="relative z-10 flex flex-col items-center text-center gap-8">
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white/70">
            SRM Kattankulathur · 2026–27
          </p>

          <Link
            href="/choose"
            className="group inline-flex items-center gap-3 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight transition-transform hover:scale-[1.02]"
          >
            <span>Help me choose my hostel</span>
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-2"
            >
              →
            </span>
          </Link>

          <p className="max-w-xl text-sm sm:text-base text-white/80">
            Answer a few quick questions and find the SRM Kattankulathur
            hostel that fits you best.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {previewPills.map((pill) => (
              <span
                key={pill}
                className="rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs sm:text-sm font-medium ring-1 ring-white/20"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <div className="rounded-xl border border-border bg-background px-6 py-3 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              Map coming soon
            </p>
          </div>
          <p className="mt-3 max-w-sm text-xs text-muted-foreground">
            An interactive campus map of all SRM Kattankulathur hostels will
            live here.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">
            Frequently asked questions
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Quick answers to common hostel questions.
          </p>
          <FAQAccordion />
        </div>
      </section>

      <section className="border-t border-border pt-8">
        <p className="text-sm leading-relaxed text-muted-foreground">
          This website is intended for informational purposes only. While the
          information provided has been carefully verified, some inadvertent
          errors or omissions may still exist. We apologize for any
          inconvenience this may cause. For feedback or suggestions, please
          contact us{' '}
          <Link
            href="/contact"
            className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
          >
            here
          </Link>
          .
        </p>
      </section>
    </div>
  )
}
