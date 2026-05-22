import Link from 'next/link'
import { FAQAccordion } from '@/components/faq-accordion'
import { CampusMapWrapper } from '@/components/campus-map-wrapper'
import { ArrowRight } from "lucide-react";
import { SiteFooter } from '@/components/site-footer'

export default function HomePage() {
  return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">

        {/* Full-width Rectangular Banner */}
        <section>
          <Link
              href="/choose"
              className="group flex w-full items-center justify-between rounded-[32px] border border-gray-200 bg-white p-6 sm:p-8 md:p-10 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
          >
            <div className="flex flex-col gap-1 text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 sm:text-sm">
              Academic Year 2026–27
            </span>
              <span className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
              Help me choose my hostel
            </span>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 sm:h-16 sm:w-16">
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1 sm:h-7 sm:w-7" />
            </div>
          </Link>
        </section>

        <section className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="h-100 md:h-150 overflow-hidden rounded-2xl border border-slate-200">
            <CampusMapWrapper />
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