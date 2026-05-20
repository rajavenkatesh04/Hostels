import { ContactForm } from '@/components/contact-form'

export const metadata = {
  title: 'Contact — SRM Hostels',
  description: 'Send feedback or suggestions about the SRM Kattankulathur hostel guide.',
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Contact us
        </h1>
        <p className="text-muted-foreground">
          Spotted an error? Have a suggestion? Drop us a note and we&apos;ll
          get back to you.
        </p>
      </header>

      <ContactForm />
    </div>
  )
}
