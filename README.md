# SMS Registry

Registry module of a Student Management System: enrolment, fees and payments, assessment
submission, and marksheet and results.

Next.js (App Router) · PostgreSQL · Prisma · Tailwind · shadcn/ui

## Run it locally

Needs Node.js 20+ and a PostgreSQL database.

```bash
git clone https://github.com/Rafath-Auvee/sms-registry.git
cd sms-registry
npm install          # also generates the Prisma client (postinstall)
cp .env.example .env # then set DATABASE_URL, see below
npm run setup        # creates the tables and loads the demo data
npm run dev          # http://localhost:3000
```

### Getting a database

Either way works; pick one before `npm run setup`.

**A. Your own PostgreSQL** (local install or a hosted one such as Neon or Supabase). Create an empty
database and put its URL in `.env`:

```bash
createdb sms_registry
# .env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/sms_registry"
```

**B. Docker** (nothing to install besides Docker). Start the bundled Postgres; the URL in
`.env.example` already matches it:

```bash
npm run db:up        # docker compose up, waits until Postgres is ready
```

A fresh clone has an empty database. `npm run setup` creates the tables and fills them with the demo
data, so the app opens with students, fees, submissions and grades already in place.

## Environment variables

| Variable | Example | Purpose |
|---|---|---|
| `DATABASE_URL` | `postgresql://sms:sms@localhost:5432/sms_registry` | Connection the app uses. The example matches `docker-compose.yml` (option B). On Neon, use the pooled URL (host contains `-pooler`). |
| `DIRECT_URL` | `postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require` | Optional. Direct, non-pooled URL for Prisma migrations. Needed on Neon; leave unset for plain Postgres and `DATABASE_URL` is used. |

## Database commands

| Command | What it does |
|---|---|
| `npm run setup` | Apply all migrations and load the demo data (first run) |
| `npm run db:up` | Optional: start Postgres in Docker and wait until it is ready |
| `npm run db:generate` | Generate the Prisma client into `src/generated/prisma` from `prisma/schema.prisma` (same as `npx prisma generate`) |
| `npm run db:migrate` | Create and apply a migration after a schema change (also regenerates the client) |
| `npm run db:seed` | Load the demo data (`prisma/seed.ts`); safe to run again |
| `npm run db:reset` | Drop everything, re-apply all migrations and reload the demo data |

Run the rule tests (classification, fees and overdue, late and resubmission rules) with `npm test`.

`src/generated/prisma` is not committed. It is rebuilt from the schema by `npm install` or
`npm run db:generate`; if it is missing or out of date, run `npm run db:generate`.

## Demo data

`prisma/seed.ts` clears the tables and loads a fixed data set, so every run gives the same starting
point. It covers the cases a Registry team deals with every day:

- students in every enrolment status
- fees that are paid, part paid, overdue, and overpaid (credit)
- assessments that are open and past deadline, with on-time and late submissions
- grades in every classification, published and withheld
