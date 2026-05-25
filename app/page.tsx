import Link from 'next/link'
import { FAQAccordion } from '@/components/faq-accordion'
import { CampusMapWrapper } from '@/components/campus-map-wrapper'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'

export default function HomePage() {
  return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16 sm:space-y-20">
        {/* Masthead */}
        {/*<header className="space-y-5 border-b border-stone-300 pb-10">*/}
        {/*  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs uppercase tracking-[0.18em] text-stone-500">*/}
        {/*    <span className="text-[#0c4da2]">SRM Hostels</span>*/}
        {/*    <span className="text-stone-300">/</span>*/}
        {/*    <span>Academic Year 2026–27</span>*/}
        {/*  </div>*/}
        {/*  <h1 className="font-display text-[2.5rem] font-medium leading-[1.05] tracking-tight text-stone-900 sm:text-5xl md:text-6xl max-w-3xl">*/}
        {/*    Find a place to call home on campus.*/}
        {/*  </h1>*/}
        {/*  <p className="max-w-2xl text-lg leading-relaxed text-stone-700">*/}
        {/*    Browse hostels, compare room types, and estimate your annual fees —*/}
        {/*    all in one place.*/}
        {/*  </p>*/}
        {/*</header>*/}

        {/* Primary CTA — the "choose" banner */}
        <section>
          <Link
              href="/choose"
              className="group relative block overflow-hidden rounded-sm border-2 border-[#0c4da2] bg-white transition-colors hover:bg-[#0c4da2]/[0.04]"
          >
            <div className="flex flex-col gap-6 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-9 md:px-10 md:py-10">
              <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#0c4da2] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white">
                <Sparkles className="size-3" />
                Guided
              </span>
                <h2 className="font-display text-[1.75rem] font-medium leading-tight tracking-tight text-stone-900 sm:text-[2rem] md:text-4xl">
                  Help me choose my hostel
                </h2>
                <p className="max-w-lg text-base leading-relaxed text-stone-600 md:text-lg">
                  Answer a few questions about your year, budget, and preferences
                  — we&apos;ll narrow it down for you.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#0c4da2] sm:hidden">
                Start
              </span>
                <span className="flex size-14 items-center justify-center rounded-sm border-2 border-[#0c4da2] bg-[#0c4da2] text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:size-16">
                <ArrowUpRight className="size-6 sm:size-7" strokeWidth={2} />
              </span>
              </div>
            </div>
          </Link>
        </section>

        {/* Map + FAQ */}
        <section className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5">
            <SectionHeader number="01" title="Hostels Map" />
            <p className="text-base leading-relaxed text-stone-600">
              All hostel locations across the SRM Kattankulathur campus.
            </p>
            <div className="h-[400px] overflow-hidden rounded-sm border-2 border-stone-200 md:h-[560px]">
              <CampusMapWrapper />
            </div>
          </div>

          <div className="space-y-5">
            <SectionHeader number="02" title="Frequently Asked" />
            <p className="text-base leading-relaxed text-stone-600">
              Quick answers to the questions parents and students ask most.
            </p>
            <div className="pt-2">
              <FAQAccordion />
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-stone-300 pt-10">
          <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs tracking-[0.2em] text-stone-400">
            ※
          </span>
            <p className="max-w-3xl text-sm leading-relaxed text-stone-600">
              This website is intended for informational purposes only. While the
              information provided has been carefully verified, some inadvertent
              errors or omissions may still exist. We apologise for any
              inconvenience this may cause. For feedback or suggestions, please{' '}
              <Link
                  href="/contact"
                  className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-[#0c4da2] hover:decoration-[#0c4da2]"
              >
                contact us
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
  )
}

/* ---------- Subcomponents ---------- */

function SectionHeader({
                         number,
                         title,
                       }: {
  number: string
  title: string
}) {
  return (
      <div className="flex items-baseline gap-3">
      <span className="font-mono text-xs tracking-[0.2em] text-[#0c4da2]">
        {number}
      </span>
        <h2 className="font-display text-2xl font-medium tracking-tight text-stone-900 md:text-[1.75rem]">
          {title}
        </h2>
      </div>
  )
}