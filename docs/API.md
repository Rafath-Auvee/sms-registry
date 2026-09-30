# SMS Registry API

Every write in the app goes through these routes, and the pages call them the same way you can from
Postman, Thunder Client or curl. Reads in the pages come straight from the database in Server
Components; the `GET` routes below return the same data for API clients.

Base URL: `http://localhost:3000`

## Import into Postman or Thunder Client

Import `docs/sms-registry.postman_collection.json`.

- **Postman:** Import, then choose the file.
- **Thunder Client:** Collections, then the menu, then Import, then choose the file (Postman v2.1 format).

The collection has a `baseUrl` variable and saves ids as you go (`programmeId`, `moduleId`,
`studentId`, `newStudentId`, `assessmentId`). Run the app and the seed first (`npm run setup`,
`npm run dev`), then run each folder from the top.

## Choosing a role

There is no login (the brief allows a role toggle). The role travels in a cookie, and every route
checks it on the server.

| View | Cookie header |
|---|---|
| Staff (Registry) | `Cookie: role=staff` |
| A student | `Cookie: role=student; sid=<student id>` |

With no cookie, a request counts as staff. The UI sets these cookies with `POST /api/session`; in
Postman you can send the header directly, as the collection does.

## Responses and errors

Success returns JSON with `200` (or `201` when something is created).

Every error has the same shape:

```json
{ "error": "Give a reason for withdrawing or deferring", "fields": { "reason": ["Give a reason for withdrawing or deferring"] } }
```

`fields` is present when specific inputs are wrong, keyed by field name.

| Status | Meaning |
|---|---|
| 400 | Invalid input, or the body is not valid JSON or form data |
| 403 | Wrong role for this endpoint, or a student acting outside their own record |
| 404 | The student, assessment, mark or file does not exist |
| 409 | Conflicts with existing data: duplicate email or payment reference, fee already charged, deadline passed |
| 500 | Unexpected server error (logged) |
| 503 | The database could not be reached, or its tables don't exist yet (run `npm run setup`) |

## Money and dates

- Amounts are sent in **taka** (for example `"15000.50"`) and stored and returned in **poisha**
  (1 taka = 100 poisha), so `annualFeePoisha: 12000000` is ৳1,20,000.00.
- Calendar dates (`dateOfBirth`, `dueDate`, `paidOn`) are `YYYY-MM-DD`.
- Moments (`deadline`, `submittedAt`) are ISO date-times in UTC, such as `2026-12-15T11:00:00.000Z`
  (17:00 in Dhaka).
- "Today" means today's date in Bangladesh.

---

## Session

### `POST /api/session`
Switch the view. Sets the `role` cookie, and `sid` for a student.

| Field | Type | Rules |
|---|---|---|
| `role` | `"staff"` or `"student"` | required |
| `studentId` | string | required for `student`; must be an existing student's `id` |

```json
{ "role": "student", "studentId": "cmuoc9o3f0006gsioq3s6w1ai" }
```

Returns `{ "role": "student" }`. Errors: 400 if the student does not exist.

---

## Demo data

### `POST /api/demo`
Any role. Loads the demo data, **only when the database is completely empty** (no programmes and no
students), so it can never overwrite real records. The app shows a "Load demo data" button in that
state. To reset a database that already has data, run `npm run db:seed`.

Returns `201` with `{ "message": "Seeded 2 programmes, 9 students, ..." }`. Errors: 409 if the
database already has data, 503 if the tables don't exist yet (run `npm run setup`).

---

## Programmes

### `GET /api/programmes`
Any role. Programmes with their modules, which you need for enrolling and creating assessments.

```json
[{ "id": "...", "code": "BSC-CS", "name": "BSc Computer Science", "annualFeePoisha": 12000000,
   "modules": [{ "id": "...", "code": "CS101", "title": "Programming Fundamentals" }] }]
```

---

## Students (staff)

### `GET /api/students`
List students with a fee summary each. All query parameters are optional.

| Query | Meaning |
|---|---|
| `q` | Part of the name, Student ID or email (not case sensitive) |
| `programme` | Programme `id` |
| `status` | `ENROLLED`, `DEFERRED`, `WITHDRAWN` or `COMPLETED` (other values are ignored) |

Each item includes `fees`: `chargedPoisha`, `paidPoisha`, `balancePoisha` (negative means credit),
`overduePoisha` and `daysOverdue`.

### `GET /api/students/{id}`
One student with `programme`, `statusChanges`, `charges`, `payments`, `submissions` (file details
without the file itself), `grades` and `fees`. 404 if not found.

### `POST /api/students`
Enrol a student. The Student ID (`SMS-2026-0001`) is generated from the academic year's first year.

| Field | Rules |
|---|---|
| `fullName` | 2 to 100 characters |
| `email` | valid email, stored lower case, unique |
| `dateOfBirth` | `YYYY-MM-DD`, student at least 16 |
| `programmeId` | an existing programme |
| `academicYear` | `2026/27` format, consecutive years, within 10 years of today |

```json
{ "fullName": "Nadia Rahman", "email": "nadia.rahman@example.ac.uk", "dateOfBirth": "2006-05-20",
  "programmeId": "...", "academicYear": "2026/27" }
```

Returns `201` with the student. Errors: 400 field errors, 409 email already used.

### `PATCH /api/students/{id}`
Edit details. Send the same fields as enrolment. The Student ID and status do not change here.
Errors: 404, 409 email used by another student, 409 when changing programme for a student who
already has submissions or marks (withdraw and enrol on the new programme instead).

### `POST /api/students/{id}/status`
Change enrolment status. Every change is kept in the status history.

| Field | Rules |
|---|---|
| `status` | `ENROLLED`, `DEFERRED`, `WITHDRAWN` or `COMPLETED`, different from the current one |
| `reason` | required for `WITHDRAWN` and `DEFERRED`, and when reinstating a withdrawn or completed student |

```json
{ "status": "WITHDRAWN", "reason": "Left for employment" }
```

---

## Fees and payments (staff)

### `POST /api/students/{id}/charges`
Charge the programme's current fee for the student's academic year. The amount is copied onto the
charge, so a later change to the programme fee does not rewrite it.

```json
{ "dueDate": "2026-12-01" }
```

Errors: 409 if that year is already charged, 409 if the student is not enrolled.

### `POST /api/students/{id}/payments`
Record money received.

| Field | Rules |
|---|---|
| `amount` | taka, more than 0, at most 2 decimal places |
| `paidOn` | `YYYY-MM-DD`, not in the future |
| `reference` | 3 to 50 characters, stored upper case, unique across all payments |

```json
{ "amount": "15000.00", "paidOn": "2026-09-30", "reference": "TRX-1042" }
```

Paying more than is owed is accepted and shows as credit. Errors: 409 reference already recorded.

---

## Assessments and marks

### `GET /api/assessments` (staff)
All assessments with module, programme, and submission and grade counts.

### `GET /api/assessments/{id}` (staff)
The assessment and `rows`: every student on the module's programme with their `submission` (or
`null`) and `grade` (or `null`).

### `POST /api/assessments` (staff)

| Field | Rules |
|---|---|
| `title` | 3 to 120 characters |
| `moduleId` | an existing module |
| `deadline` | ISO date-time, in the future |

```json
{ "title": "Coursework 2: Case study", "moduleId": "...", "deadline": "2026-12-15T11:00:00.000Z" }
```

### `PUT /api/grades` (staff)
Enter or change a mark. A new mark starts unpublished; changing a published mark keeps it published.

```json
{ "studentId": "...", "assessmentId": "...", "mark": 64 }
```

`mark` is a whole number from 0 to 100. Classification is worked out from it: Fail below 40, Pass
from 40, Merit from 60, Distinction from 70. Errors: 400 if the student is not on the assessment's
programme.

### `DELETE /api/grades` (staff)
Remove a mark entered by mistake. Body: `{ "studentId": "...", "assessmentId": "..." }`.
Errors: 404 if there is no mark.

### `POST /api/students/{id}/results` (staff)
Publish or withhold all of one student's marks.

```json
{ "publish": true }
```
```json
{ "publish": false, "reason": "Outstanding tuition fees. Please contact the Registry." }
```

A reason is required to withhold. Errors: 400 if the student has no marks.

---

## Submissions

### `POST /api/assessments/{id}/submission` (student)
Upload, or replace, the student's file. Body is `multipart/form-data` with one field, `file`.

- PDF or DOCX only, checked by extension and by the file's first bytes; up to 10 MB.
- Only enrolled students on the assessment's programme can submit.
- Before the deadline: submit, and replace as often as needed (the version number goes up).
- After the deadline: a first submission is accepted and marked late; replacing is refused (409).

Returns `{ "late": false, "resubmitted": true }`.

curl example:

```bash
curl -X POST http://localhost:3000/api/assessments/<assessment id>/submission \
  -H "Cookie: role=student; sid=<student id>" \
  -F "file=@essay.pdf"
```

### `GET /api/submissions/{id}/file`
Download the file. Staff can download any submission; a student only their own (anything else is 404).

---

## Student view

### `GET /api/me` (student)
The student's own record: profile, `charges`, `payments`, `submissions`, `fees`, and `results`.
In `results`, `mark` is `null` unless published, and `status` is `published`, `withheld` or
`pending`. Unpublished marks are never sent.

```json
{ "studentId": "SMS-2026-0002", "fullName": "Omar Farouk",
  "results": [{ "assessment": "Coursework 1: Algorithms report", "mark": null, "status": "pending", "withheldReason": null }] }
```
