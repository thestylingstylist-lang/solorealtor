import { createAdminClient } from "@/lib/supabase/admin"
import { generateSlots } from "@/lib/slots"
import BookingForm from "./booking-form"

export const dynamic = "force-dynamic"

export default async function BookPage() {
  let takenISO = new Set<string>()
  try {
    const admin = createAdminClient()
    const { data } = await admin.from("bookings").select("slot_start")
    takenISO = new Set(
      (data ?? []).map((r) => new Date(r.slot_start as string).toISOString())
    )
  } catch {
    // If the DB isn't reachable we still render the page with open slots;
    // the final availability re-check happens on submit.
  }

  const slots = generateSlots(takenISO)

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-16 sm:py-24">
      <header className="mb-12">
        <p className="text-sm font-medium tracking-wide text-sage">Private consultation</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          Let&rsquo;s find the right time to talk.
        </h1>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-ink/70">
          Tell me how to reach you and pick a slot that works. It takes under a minute,
          and you&rsquo;ll get a confirmation on the spot.
        </p>
      </header>
      <BookingForm slots={slots} />
      <footer className="mt-16 text-xs text-ink/40">
        Your details are only used to schedule and prepare for your consultation.
      </footer>
    </main>
  )
}
