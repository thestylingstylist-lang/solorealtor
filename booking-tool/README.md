# Booking & lead-capture tool — Phase 1

A public booking page for clients, and a private, login-protected dashboard
for the agent. Built with Next.js + Supabase, ready to deploy on Vercel.

## What's inside
- **/book** — public page. Client enters name + phone or email, picks an open
  time slot, chooses virtual or phone, and confirms.
- **/login** — agent sign-in.
- **/dashboard** — private list of every booking, sorted by date and time,
  with client name and contact info.

## The three things you'll set up (all click-through, no code)
1. **Supabase** — the database + login system.
2. **GitHub** — where the code lives.
3. **Vercel** — puts the site online.

Detailed steps are in the chat. Quick reference below.

## Environment variables (paste into Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Database
Run `supabase/schema.sql` once in the Supabase SQL Editor.

## Change your working hours / timezone / slot length
Edit `lib/config.ts`. It's plain English at the top of the file.

## Run locally (optional, for a developer)
1. `cp .env.local.example .env.local` and fill in the three values.
2. `npm install`
3. `npm run dev` → open http://localhost:3000
