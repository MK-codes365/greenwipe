Deployment notes — database env vars

You can provide database credentials to Vercel in two ways:

1) Single `DATABASE_URL` (recommended)
   - Use the full Postgres connection string with the password URL-encoded.
   - Example:
     postgresql://postgres:Master%404567@db.lmjmmkfyyohcrkcxmnar.supabase.co:5432/postgres?sslmode=require

2) Separate Postgres env vars (an alternative)
   - Set these environment variables in Vercel (Project -> Settings -> Environment Variables):
     - PGHOST (e.g. db.lmjmmkfyyohcrkcxmnar.supabase.co)
     - PGPORT (optional, default 5432)
     - PGDATABASE (e.g. postgres)
     - PGUSER (e.g. postgres)
     - PGPASSWORD (your raw password, e.g. Master@4567)
   - The app will construct a proper `DATABASE_URL` at runtime and automatically URL-encode the password.

Important
- If Prisma needs to run at build time (e.g., for `prisma generate` or migration), you must set `DATABASE_URL` in the Build scope too. Vercel's build environment won't have PGHOST/PGPASSWORD available for build-time scripts unless you also set `DATABASE_URL`.
- Avoid committing `.env` to git.

Quick redeploy steps
1. Add the env vars in Vercel (Build + Production scopes as needed).
2. Trigger a redeploy.
3. Check deployment logs and visit /api/env-check and /api/dns-check to verify runtime values and DNS resolution.
