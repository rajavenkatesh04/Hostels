'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const WEB3FORMS_ACCESS_KEY = '1f8860a0-90d3-444b-84a4-080d6f3d68d3'

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    formData.append('access_key', WEB3FORMS_ACCESS_KEY)

    const userSubject = formData.get('subject') as string
    formData.set(
        'subject',
        `[SRM Hostels v2] ${userSubject || 'New contact form submission'}`
    )

    setSubmitting(true)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Message sent — we'll get back to you soon")
        form.reset()
      } else {
        console.error('Web3Forms error:', data)
        toast.error(
            data.message || 'Something went wrong. Please try again later.'
        )
      }
    } catch (error) {
      console.error('Contact form submission failed:', error)
      toast.error('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
      <form onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="contact-name">Name</FieldLabel>
            <Input
                id="contact-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your full name"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="contact-email">Email</FieldLabel>
            <Input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
            />
            <FieldDescription>
              We&#39;ll only use this to reply to your message.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
            <Input
                id="contact-subject"
                name="subject"
                type="text"
                required
                placeholder="What is this about?"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="contact-message">Message</FieldLabel>
            <Textarea
                id="contact-message"
                name="message"
                required
                rows={6}
                placeholder="Tell us what's on your mind..."
            />
          </Field>

          <Button type="submit" size="lg" disabled={submitting}>
            <Send className="size-4" />
            {submitting ? 'Sending...' : 'Send message'}
          </Button>
        </FieldGroup>
      </form>
  )
}