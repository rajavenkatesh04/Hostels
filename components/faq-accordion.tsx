'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { faqData } from '@/data/faq'

export function FAQAccordion() {
  return (
      <Accordion className="border-t border-stone-200">
        {faqData.map((item, index) => (
            <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="group border-b border-stone-200"
            >
              <AccordionTrigger className="flex w-full items-baseline gap-4 py-5 text-left transition-colors hover:text-[#0c4da2] data-[state=open]:text-[#0c4da2] [&[data-state=open]>svg]:rotate-180 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-stone-400 [&>svg]:transition-all group-hover:[&>svg]:text-[#0c4da2] data-[state=open]:[&>svg]:text-[#0c4da2]">
            {/*<span className="font-mono text-xs tracking-[0.2em] text-stone-400 transition-colors group-hover:text-[#0c4da2] group-data-[state=open]:text-[#0c4da2]">*/}
            {/*  {String(index + 1).padStart(2, '0')}*/}
            {/*</span>*/}
                <span className="flex-1 font-display text-lg font-medium leading-snug tracking-tight md:text-xl">
              {item.question}
            </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="whitespace-pre-line pb-5 pl-9 pr-6 text-base leading-relaxed text-stone-600">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
        ))}
      </Accordion>
  )
}