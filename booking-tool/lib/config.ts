// Business rules for consultation availability.
// Edit these to change your working hours, slot length, or how far ahead clients can book.
export const BUSINESS = {
  // IANA timezone the agent works in. All slots are generated and shown in this zone.
  timezone: "America/New_York",
  // Days available: 1 = Monday ... 7 = Sunday.
  weekdays: [1, 2, 3, 4, 5],
  // Working hours in 24h time, in the timezone above.
  startHour: 9,
  endHour: 17,
  // Length of one consultation in minutes.
  slotMinutes: 30,
  // How many days into the future clients can book.
  daysAhead: 14,
} as const

export const MEETING_TYPES = ["virtual", "phone"] as const
export type MeetingType = (typeof MEETING_TYPES)[number]
