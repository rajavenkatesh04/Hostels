'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    ArrowUpRight,
    Check,
    Info,
    Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const BOOKING_URL = 'https://sp.srmist.edu.in/srmiststudentportal'

const checklist: {
    number: string
    title: string
    items: string[]
}[] = [
    {
        number: '01',
        title: 'Before booking',
        items: [
            "Check your bank account's single transaction limit. Net banking is preferable.",
            'Read all rules, regulations, and the Code of Conduct policy for the hostel.',
            'Ensure a stable internet connection throughout the process.',
        ],
    },
    {
        number: '02',
        title: 'During booking',
        items: [
            'Log in to your student portal on a single device only.',
            'Check the payment transaction log if you face any issues or have doubts about the transaction.',
            'Choose your hostel block and room type — do not wait for a specific room number.',
        ],
    },
    {
        number: '03',
        title: 'After booking',
        items: [
            'Keep your hostel room allocation order ready for check-in.',
            'Carry 2 passport-sized photographs.',
            'The Undertaking, Personal Details, and Medical forms will be emailed to you a week before reopening — fill them and bring them along.',
        ],
    },
]

export default function RedirectNotice() {
    const [isRedirecting, setIsRedirecting] = useState(false)
    const router = useRouter()

    const handleRedirect = () => {
        setIsRedirecting(true)
        setTimeout(() => {
            window.location.href = BOOKING_URL
        }, 1500)
    }

    return (
        <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            {/* Masthead */}
            <header className="space-y-5 border-b border-stone-300 pb-10">
                <h1 className="font-display text-[2.5rem] font-medium leading-[1.05] tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
                    You&apos;ll now be redirected.
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-stone-700">
                    Take a moment to review the checklist below before you continue —
                    rooms are allocated on a first-come, first-served basis.
                </p>
            </header>

            {/* Checklist */}
            <section className="space-y-8">
                <div className="space-y-2">
                    <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs tracking-[0.2em] text-[#0c4da2]">
              ※
            </span>
                        <h2 className="font-display text-2xl font-medium tracking-tight text-stone-900 md:text-[1.75rem]">
                            Booking checklist
                        </h2>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-3 md:gap-6">
                    {checklist.map((group) => (
                        <ChecklistGroup
                            key={group.number}
                            number={group.number}
                            title={group.title}
                            items={group.items}
                        />
                    ))}
                </div>
            </section>

            {/* Primary Action Area */}
            <section className="pt-2">
                <div className="space-y-6">
                    {/* Amber callout - Now full width of the container */}
                    <div className="flex items-start gap-3 rounded-sm border border-amber-300 bg-amber-50 px-4 py-4 sm:px-6 sm:py-5">
                        <Info className="mt-0.5 size-4 shrink-0 text-amber-600 sm:size-5" />
                        <div className="space-y-1.5">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-700">
                                Have these ready
                            </p>
                            <p className="text-sm leading-relaxed text-amber-900 sm:text-base">
                                Your <span className="font-medium">NetID</span> and{' '}
                                <span className="font-medium">password</span>, generated after
                                online verification. Without these, you cannot log in to the
                                portal.
                            </p>
                        </div>
                    </div>

                    {/* Actions - Back on Left, Continue on Right */}
                    <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={() => router.back()}
                            disabled={isRedirecting}
                            className="h-auto rounded-sm py-4 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 sm:w-auto"
                        >
                            <ArrowLeft className="mr-2 size-4" />
                            Go back
                        </Button>
                        <Button
                            size="lg"
                            onClick={handleRedirect}
                            disabled={isRedirecting}
                            className="group h-auto rounded-sm bg-[#0c4da2] px-8 py-4 text-base font-medium tracking-wide text-white hover:bg-[#093d82] disabled:opacity-90 sm:w-auto"
                        >
                            {isRedirecting ? (
                                <>
                                    <Loader2 className="mr-2 size-5 animate-spin" />
                                    Redirecting to portal…
                                </>
                            ) : (
                                <>
                                    Continue to SRM Portal
                                    <ArrowUpRight className="ml-2 size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

/* ---------- Subcomponents ---------- */

function ChecklistGroup({
                            number,
                            title,
                            items,
                        }: {
    number: string
    title: string
    items: string[]
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-baseline gap-3 border-b border-stone-200 pb-3">
        <span className="font-mono text-xs tracking-[0.2em] text-[#0c4da2]">
          {number}
        </span>
                <h3 className="font-display text-lg font-medium tracking-tight text-stone-900 md:text-xl">
                    {title}
                </h3>
            </div>
            <ul className="space-y-3">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
            <span
                aria-hidden
                className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border border-[#0c4da2] bg-white"
            >
              <Check className="size-2.5 text-[#0c4da2]" strokeWidth={3} />
            </span>
                        <span className="text-sm leading-relaxed text-stone-700">
              {item}
            </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}