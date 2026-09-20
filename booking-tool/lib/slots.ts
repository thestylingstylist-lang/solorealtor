import { addDays } from "date-fns"
import { fromZonedTime, formatInTimeZone } from "date-fns-tz"
import { BUSINESS } from "./config"

export type Slot = {
  startISO: string // UTC instant, the canonical value stored + submitted
  dayLabel: string // e.g. "Thu, Feb 12"
  timeLabel: string // e.g. "9:30 AM"
}

const pad = (n: number) => String(n).padStart(2, "0")

// Generates every open consultation slot from now to `daysAhead`,
// in the agent's timezone, excluding any already-booked instants.
export function generateSlots(takenISO: Set<string> = new Set()): Slot[] {
  const tz = BUSINESS.timezone
  const now = new Date()
  const slots: Slot[] = []

  for (let d = 0; d < BUSINESS.daysAhead; d++) {
    const day = addDays(now, d)
    const weekday = Number(formatInTimeZone(day, tz, "i")) // 1..7
    if (!(BUSINESS.weekdays as readonly number[]).includes(weekday)) continue

    const dateStr = formatInTimeZone(day, tz, "yyyy-MM-dd")
    const totalMinutes = (BUSINESS.endHour - BUSINESS.startHour) * 60

    for (let m = 0; m < totalMinutes; m += BUSINESS.slotMinutes) {
      const hour = BUSINESS.startHour + Math.floor(m / 60)
      const minute = m % 60
      const wallClock = `${dateStr}T${pad(hour)}:${pad(minute)}:00`
      const startUTC = fromZonedTime(wallClock, tz)

      if (startUTC.getTime() <= now.getTime()) continue // no past slots
      const iso = startUTC.toISOString()
      if (takenISO.has(iso)) continue

      slots.push({
        startISO: iso,
        dayLabel: formatInTimeZone(startUTC, tz, "EEE, MMM d"),
        timeLabel: formatInTimeZone(startUTC, tz, "h:mm a"),
      })
    }
  }
  return slots
}

// True if a submitted instant is a real, currently-open slot.
// Prevents someone hand-crafting a request for a past/invalid/taken time.
export function isValidOpenSlot(startISO: string, takenISO: Set<string>): boolean {
  return generateSlots(takenISO).some((s) => s.startISO === startISO)
}

// For display on the dashboard: format a stored instant in the agent's zone.
export function formatSlot(startISO: string): string {
  return formatInTimeZone(new Date(startISO), BUSINESS.timezone, "EEE, MMM d · h:mm a")
}
