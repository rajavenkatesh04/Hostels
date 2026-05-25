import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export const metadata = {
  title: 'About — SRM Hostels',
  description:
      'A student-built guide to help new admits choose a hostel at SRM Kattankulathur.',
}

const officialResources = [
  {
    label: 'SRM Student Portal',
    description: 'Official booking portal for hostel allotment.',
    href: 'https://sp.srmist.edu.in/srmiststudentportal',
  },
  {
    label: 'Code of Conduct',
    description: 'University-wide student code of conduct.',
    href: 'https://www.srmist.edu.in/policies/code-of-conduct-for-students/',
  },
  {
    label: 'Hostel Rules (2025)',
    description: 'Official PDF of hostel rules and regulations.',
    href: 'https://webstor.srmist.edu.in/web_assets/downloads/2025/srm-hostel-rules-2025.pdf',
  },
]

export default function AboutPage() {
  return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Masthead */}
        <header className="space-y-5 border-b border-stone-300 pb-10">
          {/*<div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs uppercase tracking-[0.18em] text-stone-500">*/}
          {/*  <span className="text-[#0c4da2]">About</span>*/}
          {/*  <span className="text-stone-300">/</span>*/}
          {/*  <span>Student-Built</span>*/}
          {/*  <span className="text-stone-300">/</span>*/}
          {/*  <span>Unofficial</span>*/}
          {/*</div>*/}
          <h1 className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
            About SRM Hostels.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-stone-700">
            A simple, student-built guide to help new admits at SRM
            Kattankulathur compare hostels side by side and pick the one that
            fits. No login, no ads, no data collection — just the information
            you need before you book.
          </p>
        </header>

        <Section number="01" title="What is this">
          <p>
            This site is an unofficial reference for first-year students
            choosing between the various boys&apos; and girls&apos; hostels at
            SRM Kattankulathur. It collects room types, prices, warden contacts,
            and map locations into one place so you can compare options without
            flipping between PDFs and spreadsheets.
          </p>
          <p>
            All bookings still happen on the official{' '}
            <ExternalA href="https://sp.srmist.edu.in/srmiststudentportal">
              SRM Student Portal
            </ExternalA>
            . If anything on this site disagrees with the portal or an official
            circular, the official source wins.
          </p>
        </Section>

        <Section number="02" title="How it works">
          <ol className="space-y-5 pl-0">
            <Step n={1} title="Browse or pick">
              Use{' '}
              <InternalA href="/hostels">Browse hostels</InternalA> to see
              everything at a glance, or use the{' '}
              <InternalA href="/choose">guided picker</InternalA> to narrow down
              by gender, AC, washroom, and room sharing.
            </Step>
            <Step n={2} title="Compare features and prices">
              Open any hostel to see room types, total annual cost (room + mess
              + optional laundry), warden contacts, and walking distance to the
              University Building.
            </Step>
            <Step n={3} title="Proceed to booking">
              Click{' '}
              <span className="font-medium text-stone-900">
              Proceed to Booking
            </span>{' '}
              on the hostel page to jump to the official SRM Student Portal in a
              new tab.
            </Step>
          </ol>
        </Section>

        <Section number="03" title="Built by">
          <p>
            Built by{' '}
            <ExternalA href="https://rajavenkatesh.dev">
              Raja Venkatesh
            </ExternalA>
            , a fellow SRM student. This is a side project — feedback and
            corrections are welcome.
          </p>
        </Section>

        <Section number="04" title="Found an issue">
          <p>
            Spotted incorrect pricing, an outdated warden contact, or a missing
            hostel? Let me know via the{' '}
            <InternalA href="/contact">contact form</InternalA>.
          </p>
        </Section>

        <Section number="05" title="Official resources">
          <ul className="space-y-px overflow-hidden rounded-sm border border-stone-200 bg-stone-200">
            {officialResources.map((r) => (
                <li key={r.href}>
                  <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between gap-4 bg-white p-5 transition-colors hover:bg-[#0c4da2]/[0.04]"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="font-display text-lg font-medium text-stone-900 transition-colors group-hover:text-[#0c4da2]">
                        {r.label}
                      </p>
                      <p className="text-sm leading-relaxed text-stone-600">
                        {r.description}
                      </p>
                    </div>
                    <span
                        aria-hidden
                        className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-sm border border-stone-300 text-stone-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-[#0c4da2] group-hover:bg-[#0c4da2] group-hover:text-white"
                    >
                  <ArrowUpRight className="size-4" />
                </span>
                  </a>
                </li>
            ))}
          </ul>
        </Section>
      </div>
  )
}

/* ---------- Subcomponents ---------- */

function Section({
                   number,
                   title,
                   children,
                 }: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
      <section className="space-y-5">
        <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs tracking-[0.2em] text-[#0c4da2]">
          {number}
        </span>
          <h2 className="font-display text-2xl font-medium tracking-tight text-stone-900 md:text-[1.75rem]">
            {title}
          </h2>
        </div>
        <div className="space-y-4 pl-8 text-base leading-relaxed text-stone-700">
          {children}
        </div>
      </section>
  )
}

function Step({
                n,
                title,
                children,
              }: {
  n: number
  title: string
  children: React.ReactNode
}) {
  return (
      <li className="flex gap-4">
      <span className="mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[#0c4da2] bg-white font-mono text-xs font-medium text-[#0c4da2]">
        {n}
      </span>
        <div className="space-y-1">
          <p className="font-display text-lg font-medium tracking-tight text-stone-900">
            {title}
          </p>
          <p className="text-base leading-relaxed text-stone-700">{children}</p>
        </div>
      </li>
  )
}

function InternalA({
                     href,
                     children,
                   }: {
  href: string
  children: React.ReactNode
}) {
  return (
      <Link
          href={href}
          className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-[#0c4da2] hover:decoration-[#0c4da2]"
      >
        {children}
      </Link>
  )
}

function ExternalA({
                     href,
                     children,
                   }: {
  href: string
  children: React.ReactNode
}) {
  return (
      <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-[#0c4da2] hover:decoration-[#0c4da2]"
      >
        {children}
      </a>
  )
}