# ETHAN Learn v4.1 — Supabase Setup

The browser-safe Supabase Project URL and publishable key are already configured in `config.js`.

## 1. Create database tables
Open your ETHAN Learn Supabase project → SQL Editor → New query.
Paste and run `supabase/v4.1-auth-and-sync.sql`.

## 2. Authentication settings
Supabase Dashboard → Authentication → Providers → Email:
- Keep Email enabled.
- Email confirmation is recommended for public launch.

Authentication → URL Configuration:
- Site URL: set this to the live ETHAN Learn domain.
- Add the live ETHAN Learn URL to Redirect URLs.
- Password recovery returns to `/#/reset-password`.
- Signup confirmation returns to `/#/account`.

For local testing, add the local development origin only if you need it.

## 3. Test
1. Open ETHAN Learn.
2. Create Account.
3. If email confirmation is enabled, confirm the email.
4. Sign in.
5. Complete a lesson or save a note.
6. Sign out and back in to verify cloud progress sync.

Never place a Supabase service-role key or database password in this frontend.
