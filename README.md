# SMS Registry

The Registry module of a Student Management System: the four workflows a Registry Administrator uses every day.

1. **Enrolment:** student records, generated Student IDs, status changes, search and filters.
2. **Fees and payments:** programme fees, payments, live balances, overdue flags.
3. **Assessment submission:** PDF or DOCX uploads, resubmission before the deadline, late work flagged.
4. **Marksheet and results:** marks, classification, publish or withhold per student.

Built with Next.js 16 (App Router), PostgreSQL, Prisma 7, Tailwind CSS and shadcn/ui, with
[anime.js](https://animejs.com) for motion and landing page components chosen from
[21st.dev](https://21st.dev).

## Contents

- [Run it locally](#run-it-locally)
- [Environment variables](#environment-variables)
- [Commands](#commands)
- [Using the app](#using-the-app)
- [Demo data](#demo-data)
- [API](#api)
- [Folder structure](#folder-structure)
- [Data model](#data-model)
- [Registry rules and edge cases](#registry-rules-and-edge-cases)
- [Error handling](#error-handling)
- [Decisions and trade offs](#decisions-and-trade-offs)
- [What I would build next](#what-i-would-build-next)
- [How I used AI](#how-i-used-ai)

## Run it locally

Needs Node.js 20 or newer.

```bash
git clone https://github.com/Rafath-Auvee/sms-registry.git
cd sms-registry
cp .env.example .env
npm install          # also generates the Prisma client
npm run dev          # http://localhost:3000
```

`.env.example` points at a shared demo database on Neon that is already migrated and seeded, so the
app opens with data straight away. To reset that data to the starting point, run `npm run db:seed`.

### Using your own database instead

Put its URL in `.env`, then run `npm run setup`, which creates the tables and loads the demo data.

**A. Any PostgreSQL** (local install, Neon, Supabase and so on):

```bash
createdb sms_registry
# .env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/sms_registry"
```

For Neon, use the pooled URL as `DATABASE_URL` and the direct URL as `DIRECT_URL`.

**B. Docker** (nothing else to install):

```bash
npm run db:up        # starts Postgres from docker-compose.yml and waits until it is ready
# .env
DATABASE_URL="postgresql://sms:sms@localhost:5432/sms_registry"
```

Then:

```bash
npm run setup        # apply migrations and load the demo data
npm run dev
```

If you skip `npm run setup`, the app doesn't crash: it tells you the tables are missing and which
command to run. On an empty database it offers a **Load demo data** button.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | Connection the app uses. On Neon, the pooled URL (host contains `-pooler`). |
| `DIRECT_URL` | Neon only | Direct, non pooled URL for Prisma migrations. Leave it out (or empty) for plain Postgres and `DATABASE_URL` is used. |

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the app on http://localhost:3000 |
| `npm run setup` | Apply all migrations and load the demo data (first run on a new database) |
| `npm run db:seed` | Reset the demo data (clears every table, then reloads) |
| `npm run db:migrate` | Create and apply a migration after changing `prisma/schema.prisma` |
| `npm run db:generate` | Regenerate the Prisma client into `src/generated/prisma` (same as `npx prisma generate`) |
| `npm run db:reset` | Drop everything, reapply migrations and reload the demo data |
| `npm run db:up` | Optional: start Postgres in Docker |
| `npm test` | Run the rule tests (classification, fees and overdue, late and resubmission, dates) |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript checks |
| `npm run build` | Production build |

`src/generated/prisma` is not committed. `npm install` rebuilds it; if it is ever missing or out of
date, run `npm run db:generate`.

## Using the app

The landing page at `/` offers two views:

- **Registry staff:** dashboard, students, fees, assessments and results.
- **Student:** pick a student, then see their overview, assessments (upload) and results.

Switch views any time with the selector in the top bar. The app is dark by default; the sun and moon
button switches theme.

| Page | Purpose |
|---|---|
| `/staff` | Dashboard: enrolled count, fees outstanding, overdue students, late submissions, marks waiting to be published, upcoming deadlines |
| `/staff/students` | Search by name, ID or email; filter by programme and status |
| `/staff/students/new` | Enrol a student |
| `/staff/students/[id]` | Profile tabs: overview and status history, fees, submissions, results |
| `/staff/students/[id]/edit` | Edit details |
| `/staff/fees` | Every balance, filtered by overdue, outstanding, in credit, not charged |
| `/staff/assessments` | Assessments and "New assessment" |
| `/staff/assessments/[id]` | Who submitted, late or missing, file downloads, mark entry |
| `/staff/results` | Publish or withhold results per student |
| `/student` | The student's details and fee statement |
| `/student/assessments` | Upload or replace files |
| `/student/results` | Marksheet, published marks only |

## Demo data

`src/lib/demo-data.ts` (run by `npm run db:seed`) loads 2 programmes (BSc Computer Science
৳1,20,000 a year, BA Business Management ৳95,000 a year), 4 modules, 9 students, 4 assessments,
7 submissions and 7 marks. Dates are relative to the day you run it, so "overdue" and "late" stay
true.

| Student | What it shows |
|---|---|
| Amelia Hart | Paid in full; resubmitted a file before the deadline; Distinction, published |
| Omar Farouk | Part paid, not yet due; submitted 2 days late; Pass, not yet published |
| Priya Nair | Overdue 45 days; Fail, not yet published |
| Yusuf Ahmed | Fee not charged yet; never submitted (shows as missing) |
| Daniel Okafor | Deferred, with the reason in the status history |
| Sofia Rossi | Overpaid, ৳5,000 in credit; Merit, published |
| Liam Walsh | Overdue 12 days; submitted 5 hours late; results withheld for unpaid fees |
| Chloe Martin | Withdrawn, still owes fees; shows as "not expected" on assessments |
| Hannah Lee | Completed, from the previous cohort (`SMS-2025-0001`); Distinction, published |

## API

Every write goes through an API route, and each route checks the caller's role on the server.

- **Full reference** (request bodies, rules, error codes): [`docs/API.md`](docs/API.md)
- **Postman or Thunder Client:** import [`docs/sms-registry.postman_collection.json`](docs/sms-registry.postman_collection.json).
  List requests save ids into collection variables, so run each folder from the top.

The role is sent as a cookie: `role=staff`, or `role=student; sid=<student id>`.

| Method | Path | Role | Purpose |
|---|---|---|---|
| POST | `/api/session` | any | Switch view (sets the role cookies) |
| POST | `/api/demo` | any | Load demo data, only into an empty database |
| GET | `/api/programmes` | any | Programmes and their modules |
| GET | `/api/students` | staff | List, with `?q=`, `?programme=`, `?status=` |
| POST | `/api/students` | staff | Enrol; generates the Student ID |
| GET | `/api/students/{id}` | staff | Full record with fees, submissions and marks |
| PATCH | `/api/students/{id}` | staff | Edit details |
| POST | `/api/students/{id}/status` | staff | Change status, with a reason where needed |
| POST | `/api/students/{id}/charges` | staff | Charge the programme fee for the academic year |
| POST | `/api/students/{id}/payments` | staff | Record a payment |
| POST | `/api/students/{id}/results` | staff | Publish or withhold all of a student's marks |
| GET | `/api/assessments` | staff | List assessments |
| POST | `/api/assessments` | staff | Create an assessment |
| GET | `/api/assessments/{id}` | staff | Roster: every student's submission and mark |
| PUT | `/api/grades` | staff | Enter or change a mark |
| DELETE | `/api/grades` | staff | Remove a mark |
| POST | `/api/assessments/{id}/submission` | student | Upload or replace a file (multipart `file`) |
| GET | `/api/submissions/{id}/file` | staff, or the owning student | Download a submission |
| GET | `/api/me` | student | Own record; only published marks |

Errors always look like `{ "error": "message", "fields": { "field": ["message"] } }` with status
400, 403, 404, 409, 500 or 503.

## Folder structure

```
sms-registry/
├── prisma/
│   ├── schema.prisma          Data model
│   ├── migrations/            SQL migrations, applied in order
│   └── seed.ts                Runs the demo data loader (npm run db:seed)
├── docs/
│   ├── API.md                 API reference
│   └── sms-registry.postman_collection.json
├── src/
│   ├── app/                   Routes (Next.js App Router)
│   │   ├── page.tsx           Landing page: choose a view
│   │   ├── layout.tsx         Fonts, theme, toasts
│   │   ├── error.tsx          Shown when a page fails to load, with Try again
│   │   ├── not-found.tsx
│   │   ├── staff/             Staff pages; layout.tsx adds the sidebar, checks the role and the database
│   │   ├── student/           Student pages; layout.tsx checks the role, the database and the student
│   │   └── api/               Route handlers, one folder per resource
│   ├── components/
│   │   ├── ui/                shadcn/ui building blocks (button, card, table, dialog and so on)
│   │   ├── layout/            App shell, sidebar, view switcher, theme
│   │   ├── common/            Shared pieces: page header, stat card, badges, empty state, setup notice
│   │   ├── students/          Student table, filters, form, status dialog and history
│   │   ├── fees/              Balance badge, fee summary, ledger, charge and payment dialogs
│   │   ├── assessments/       Assessment table, roster, upload form, submission badges
│   │   ├── results/           Mark input, marksheet, publish and withhold controls
│   │   ├── dashboard/         Overdue, late and deadline cards
│   │   ├── landing/           Landing page: hero, live numbers, feature bento, view picker
│   │   └── motion/            anime.js: staggered reveal and counting numbers
│   ├── hooks/
│   │   └── use-submit.ts      Runs a request, shows a toast, keeps field errors, refreshes data
│   ├── lib/
│   │   ├── registry.ts        Business rules: classification, fee and overdue maths, submission rules, dates
│   │   ├── registry.test.ts   Tests for those rules
│   │   ├── schemas.ts         Input validation (zod), shared by every API route
│   │   ├── queries.ts         Database reads used by pages and GET routes, and the database state check
│   │   ├── api.ts             Route wrapper: role checks, error responses, JSON and form parsing
│   │   ├── demo-data.ts       The demo data set
│   │   ├── student-id.ts      Student ID generator
│   │   ├── session.ts         Reads the role cookies
│   │   ├── client.ts          Browser side fetch helper
│   │   ├── format.ts          Taka, dates in Bangladesh time, labels
│   │   └── db.ts              Prisma client
│   └── generated/prisma/      Generated Prisma client (not committed)
├── .env.example
├── docker-compose.yml         Optional local Postgres
└── prisma.config.ts           Prisma CLI settings (schema, migrations, seed)
```

How a change flows: a page (Server Component) reads through `lib/queries.ts`; a form (Client
Component) calls an API route through `lib/client.ts`; the route checks the role, validates with
`lib/schemas.ts`, applies the rules in `lib/registry.ts`, writes with Prisma, and the page refreshes.

## Data model

| Table | Holds | Notes |
|---|---|---|
| `Programme` | Code, name, annual fee | The fee is the current price only |
| `Module` | Code, title, programme | Assessments belong to a module |
| `Student` | Student ID, name, email, date of birth, programme, academic year, status | Email unique; Student ID unique and never reused |
| `IdCounter` | Last number used per year | Makes Student IDs safe when two are created at once |
| `StatusChange` | From, to, reason, when | The history behind every status |
| `FeeCharge` | Amount, due date, academic year | One per student per year; the amount is copied from the programme |
| `Payment` | Amount, date, reference | Reference unique, so a payment can't be recorded twice |
| `Assessment` | Title, module, deadline | |
| `Submission` | File, size, type, submitted at, version | One per student per assessment; replacing bumps the version |
| `Grade` | Mark, published, withheld reason | One per student per assessment |

Choices behind it:

- **Money is stored as whole poisha** (1 taka = 100 poisha), never as decimals, so sums are exact.
- **The balance is computed, not stored.** Charges minus payments, worked out on every read, so it
  can't drift out of sync.
- **Lateness and classification are computed, not stored.** Late means submitted after the deadline;
  if a deadline is extended, earlier submissions stop being late automatically.
- **Charges copy the fee.** Raising a programme's fee next year doesn't change what this year's
  students were billed.
- **Nothing is deleted.** A student who leaves is marked Withdrawn and keeps their record, payments
  and history, as a registry needs for audits.
- **Files are stored in Postgres** (up to 10 MB each), so there is no separate storage account to set
  up and the app runs the same everywhere. At scale they would move to object storage.

## Registry rules and edge cases

| Situation | What happens |
|---|---|
| Two students enrolled at the same moment | Each gets a different ID (counter updated in a transaction, retried on a clash) |
| Duplicate email | Refused, not case sensitive |
| Student under 16, or an impossible academic year | Refused with a field message |
| Withdrawing or deferring | Reason required; recorded in the status history |
| Reinstating a withdrawn or completed student | Reason required |
| Changing programme after coursework exists | Refused: withdraw and enrol on the new programme instead |
| Charging a withdrawn, deferred or completed student | Refused; only enrolled students are charged |
| Charging the same year twice | Refused |
| Payment larger than the balance | Accepted and shown as credit |
| Payment dated in the future, or with more than 2 decimals | Refused |
| Same payment reference twice | Refused |
| Fee past its due date and not fully paid | Flagged overdue with days overdue; payments settle the oldest charge first |
| "Today" | Taken in Bangladesh time, so a payment made at 2am local time is not "in the future" |
| Upload that isn't really a PDF or DOCX (for example a renamed image) | Refused; the server checks the file's first bytes |
| File over 10 MB | Refused, in the browser first and again on the server |
| Resubmitting before the deadline | Replaces the file, version goes up |
| First submission after the deadline | Accepted and flagged late, with how late |
| Replacing a file after the deadline | Refused |
| Deferred, withdrawn or completed student uploading | Refused |
| Assessment on another programme | Refused for upload and for marks |
| Assessment deadline in the past | Refused when creating |
| No submission after the deadline | Shown as missing; "not expected" if the student is no longer enrolled |
| Mark outside 0 to 100, or not a whole number | Refused |
| Mark entered by mistake | Clear the field to remove it |
| New marks | Start unpublished; the student sees "Pending" |
| Unpublished marks | Never sent to the student's browser or to `/api/me` |
| Results withheld | Student sees the reason, not the marks |
| Fees overdue when withholding | The withhold reason is suggested ("Outstanding tuition fees"); staff decide |
| A student asking for another student's file | Not found |
| Student removed by a reseed while being viewed | The app asks you to pick a student again |
| Database tables missing | Every page explains to run `npm run setup`; the API returns 503 |
| Database empty | Pages offer "Load demo data", which only works while the database is empty |
| Database unreachable | Pages say so and suggest checking `DATABASE_URL`; the API returns 503 |

## Error handling

- **API:** every route is wrapped by `route()` in `lib/api.ts`. Validation errors return 400 with a
  message for each field; wrong role 403; missing records 404; conflicts 409; an unreachable or
  unset database 503; anything unexpected 500, with the detail logged on the server and never sent to
  the browser. A body that isn't valid JSON or form data is a 400, not a crash.
- **Forms:** show the server's message under each field and in a toast. Buttons disable while saving,
  so nothing is sent twice. Uploads check type and size in the browser before sending.
- **Pages:** the database state is checked first (ready, empty, no tables, unreachable) and explained
  if it isn't ready. A failed load shows an error page with Try again; an unknown record shows a Not
  found page; loading shows skeletons.
- **Filters:** unknown values in the URL are ignored rather than breaking the page.

## Decisions and trade offs

- **No login.** The brief allows a role toggle. The role lives in a cookie and every API route checks
  it, so the separation holds on the server, not just in the UI.
- **Pages read, API routes write.** Server Components read the database directly, which is simpler
  and faster than calling our own API. Every change goes through an API route, so the rules live in
  one place, and the same routes serve Postman and curl.
- **Native HTML where it's enough:** date inputs, a native select (styled by shadcn), link based filter
  tabs that keep filters in the URL.
- **Currency and time:** Bangladeshi Taka with lakh grouping (৳1,20,000.00), times in Bangladesh time.
- **Motion with [anime.js](https://animejs.com):** I added anime.js for the entrance animations
  (cards and sections fade in one after another) and the dashboard numbers that count up. It lives in
  two small components, `components/motion/reveal.tsx` and `components/motion/count-up.tsx`, and is
  turned off for users who ask for reduced motion.
- **Landing page components from [21st.dev](https://21st.dev):** I picked the landing page components
  on 21st.dev, the community catalogue of shadcn compatible components: grid pattern, aurora text,
  animated shiny text and shimmer button. 21st.dev's installer needs an account key, so they are
  installed from their original open source registry, [Magic UI](https://magicui.design), with the
  shadcn CLI (`npx shadcn add https://magicui.design/r/<name>.json`) into `components/ui`. They are
  plain CSS and SVG, with no extra animation library.
- **Loading states:** buttons show a spinner and forms lock while saving; the student search shows a
  spinner and dims the results until the new list arrives; pages show skeletons shaped like their
  content.

## What I would build next

- Sign in, with each student account linked to its Student record, and staff roles (Registry,
  Finance, Academic) so that, for example, only Finance records payments.
- An audit log for mark changes and publication.
- Fee instalment plans, discounts and refunds.
- Deadline extensions per student, for mitigating circumstances.
- Files in object storage (S3 or R2) with virus scanning.
- Bulk mark upload from CSV, and CSV export for finance.

## How I used AI

> Draft: to be reviewed and edited so it matches exactly how I worked.

I used **Claude Code** (Anthropic's coding assistant, in the terminal) as a pair programmer
throughout.

**What I asked it to do**
- Read the brief and turn it into a checklist and a plan, which I then cut down to a one to two day
  build.
- Propose the data model, which I reviewed against how a registry office actually works (fees copied
  onto charges, nothing deleted, status history).
- Write most of the code: schema, API routes, validation, pages and components, demo data and tests.
- Test its own work: it drove the API with real requests for every rule above, checked each page in a
  headless browser at desktop and phone widths, and ran the app against an empty database, a database
  with no tables and an unreachable one.

**Decisions I made**
- Neon over Docker, so the database needs no local setup; Docker kept as an option.
- Bangladeshi Taka and Bangladesh time; dark theme by default; a landing page.
- anime.js for motion, and landing page components from 21st.dev, so the UI doesn't look like stock
  shadcn.
- Components split by feature, with no single page holding a large UI.
- Keeping the role toggle instead of building login, as the brief allows.
- An API reference and a Postman collection, and graceful handling of an empty database.

**Where the AI was wrong and I corrected it**
- It installed a Prisma 8 release candidate next to the Prisma 7 client; pinned both to 7.10.
- It computed "today" in UTC, so payments made after midnight in Bangladesh were refused as future
  dated. Fixed to use Bangladesh time, with a test.
- It counted deferred and withdrawn students as "missing" submissions.
- The landing page was built as a static page, so it showed stale data; it now renders per request.
- shadcn's setup left the font variable pointing at itself, so the UI fell back to a serif font.
- Buttons rendered as links were missing the Base UI setting that keeps them accessible.

**How I checked the output:** I read every change, ran the lint, type check, tests and build, and
clicked through every page in both views before submitting.
