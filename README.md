# Abra Builds Things

Simple landing site: pitches + a passcode-gated message center. No auto-emails —
messages are logged to a database and read on-site, replies happen from your own
regular email.

## One-time setup

1. Create a Postgres database (e.g. a Neon project) and set `DATABASE_URL` in your
   Vercel project's Environment Variables.
2. Run the migration in `migrations/001_messages.sql` against that database once
   (via your database's SQL editor, or `psql "$DATABASE_URL" -f migrations/001_messages.sql`).
3. Set `OWNER_PASSCODE` in Environment Variables — this is the passcode you'll use
   on the live site to unlock the message center and read incoming messages.
4. Redeploy so the new environment variables take effect.

## Local dev

```
npm install
npm run dev
```
