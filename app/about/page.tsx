import Link from 'next/link'
import {
  ArrowUpRight,
  ExternalLink,
  HelpCircle,
  ListChecks,
  MessageSquare,
  User,
} from 'lucide-react'

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
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
      <header className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          About SRM Hostels
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          A simple, student-built guide to help new admits at SRM Kattankulathur
          compare hostels side by side and pick the one that fits. No login, no
          ads, no data collection — just the information you need before you
          book.
        </p>
      </header>

      <Section icon={HelpCircle} title="What is this?">
        <p>
          This site is an unofficial reference for first-year students choosing
          between the various boys&apos; and girls&apos; hostels at SRM
          Kattankulathur. It collects room types, prices, warden contacts, and
          map locations into one place so you can compare options without
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

      <Section icon={ListChecks} title="How it works">
        <ol className="space-y-3 list-none counter-reset-step pl-0">
          <Step n={1} title="Browse or pick">
            Use{' '}
            <Link href="/hostels" className="text-primary hover:underline">
              Browse hostels
            </Link>{' '}
            to see everything at a glance, or use the{' '}
            <Link href="/choose" className="text-primary hover:underline">
              guided picker
            </Link>{' '}
            to narrow down by gender, AC, washroom, and room sharing.
          </Step>
          <Step n={2} title="Compare features and prices">
            Open any hostel to see room types, total annual cost (room + mess +
            optional laundry), warden contacts, and walking distance to the
            University Building.
          </Step>
          <Step n={3} title="Proceed to booking">
            Click <strong>Proceed to Booking</strong> on the hostel page to
            jump to the official SRM Student Portal in a new tab.
          </Step>
        </ol>
      </Section>

      <Section icon={User} title="Built by">
        <p>
          Built by{' '}
          <ExternalA href="https://rajavenkatesh.dev">Raja Venkatesh</ExternalA>
          , a fellow SRM student. This is a side project — feedback and
          corrections are welcome.
        </p>
      </Section>

      <Section icon={MessageSquare} title="Found an issue?">
        <p>
          Spotted incorrect pricing, an outdated warden contact, or a missing
          hostel? Let me know via the{' '}
          <Link href="/contact" className="text-primary hover:underline">
            contact form
          </Link>
          .
        </p>
      </Section>

      <Section icon={ExternalLink} title="Official resources">
        <ul className="space-y-3">
          {officialResources.map((r) => (
            <li key={r.href}>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-4 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{r.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {r.description}
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
        <Icon className="size-5 text-muted-foreground" />
        {title}
      </h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">
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
    <li className="flex gap-3">
      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
        {n}
      </span>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p>{children}</p>
      </div>
    </li>
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
      className="text-primary hover:underline"
    >
      {children}
    </a>
  )
}
