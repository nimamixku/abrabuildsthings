# Abra Builds Things

Simple landing site: pitches + a passcode-gated message center. Messages are
logged to a database and read on-site; a lightweight email notification also
goes out so you don't miss one, but replying happens from your own regular
email, not through the app.

## One-time setup

1. Create a Postgres database (e.g. a Neon project) and set `DATABASE_URL` in your
   Vercel project's Environment Variables.
2. Run the migration in `migrations/001_messages.sql` against that database once
   (via your database's SQL editor, or `psql "$DATABASE_URL" -f migrations/001_messages.sql`).
3. Set `OWNER_PASSCODE` in Environment Variables — this is the passcode you'll use
   on the live site to unlock the message center and read incoming messages.
4. For email notifications when a new message arrives, sign up at resend.com,
   grab an API key, and set:
   - `RESEND_API_KEY` — your Resend API key
   - `RESEND_FROM_EMAIL` — the sending address. `onboarding@resend.dev` works
     immediately with no setup since this only ever sends to your own
     notification address (bibleneworleans@gmail.com, set in
     app/api/contact/route.js). If you'd rather send from your own domain,
     verify it in Resend and use that address instead.
   If these two aren't set, the site still works fine — messages still save
   and show up in the message center, you just won't get an email ping.
5. Redeploy so the new environment variables take effect.

## Local dev

```
npm install
npm run dev
```
