# R Colors Group website

React (Vite + TypeScript + Tailwind) frontend and Spring Boot (Java 21) backend.

```
frontend/   React app: pages, components, styles, images (public/), estate data scripts
backend/    Spring Boot API: content + estate data, contact/enquiry forms, database
docs/       ADDING-DATA.md: how to add cities, localities, listings, projects, agents, and manage careers
Dockerfile  one image that serves the React build and the API together
```

## Run locally

Needs Node 20+, Java 21+ and Maven.

```bash
# 1. API on http://localhost:8080 (H2 database file in backend/data/)
cd backend
mvn spring-boot:run

# 2. Site on http://localhost:3000 (proxies /api to the backend)
cd frontend
npm install
npm run dev
```

To use the admin panel (`/admin`) locally, start the backend with the admin variables set
(see [Admin login](#admin-login)):

```bash
ADMIN_USERNAME=admin ADMIN_PASSWORD_HASH='$2a$12$...' ADMIN_JWT_SECRET="$(openssl rand -base64 48)" mvn spring-boot:run
```

`SPRING_PROFILES_ACTIVE=dev` also adds two sample draft jobs to an empty database.

If port 8080 is taken, start the backend with `PORT=8090 mvn spring-boot:run` and the
frontend with `API_PROXY_TARGET=http://localhost:8090 npm run dev`.

## Checks

```bash
cd frontend && npm run typecheck && npm test && npm run validate:data
cd backend && mvn test
```

## API

| Method | Path | |
| --- | --- | --- |
| GET | `/api/projects`, `/api/projects/{id}` | portfolio (`backend/src/main/resources/data/projects.json`) |
| GET | `/api/clients` | clients (`data/clients.json`) |
| GET | `/api/estate/cities` | cities in the estate city dropdown |
| GET | `/api/estate/cities/{slug}` | everything one city page needs (locations, listings, projects, agents) |
| POST | `/api/contact` | contact form (form-urlencoded) → `contact_message` table |
| POST | `/api/estate/enquiries` | estate enquiry form → `estate_enquiry` table |
| GET | `/api/careers/jobs` | open jobs (not past their deadline), newest first; `?business=&location=&employmentType=&q=` |
| GET | `/api/careers/jobs/{slug}` | one job; drafts/archived are 404, closed or expired jobs return `acceptingApplications: false` |
| GET | `/api/careers/filters` | businesses, locations and job types that open jobs have |
| POST | `/api/careers/jobs/{slug}/applications` | application (multipart, `resume` PDF/DOC/DOCX ≤ 5 MB) → `201 {"id"}` |
| POST | `/api/careers/applications` | general application without a job (same fields) |

Invalid form posts get `400 {"errors": {"field": "message"}}`. Applications also answer
`409` (job closed, or the same email applied to it in the last 30 days) and `429`
(more than 5 applications per IP per hour) in the same shape.

Admin API (`Authorization: Bearer <token>`, otherwise `401 {"errors": {"auth": ...}}`):

| Method | Path | |
| --- | --- | --- |
| POST | `/api/admin/auth/login` | `{username, password}` → `{token, expiresAt}` (8 h); 5 failures per IP per 15 min → `429` |
| GET | `/api/admin/auth/me` | `{username}` |
| GET, POST | `/api/admin/jobs` | list (`?status=&q=&page=&size=`, with application counts) / create |
| GET, PUT, DELETE | `/api/admin/jobs/{id}` | one job; delete only for drafts without applications (`409` otherwise) |
| PATCH | `/api/admin/jobs/{id}/status` | `{status}`: publish (`OPEN`), close, reopen, archive |
| POST | `/api/admin/jobs/{id}/duplicate` | copy as a new draft |
| GET | `/api/admin/applications` | `?jobId=<id or general>&status=&q=&from=&to=&page=&size=&sort=newest\|oldest` |
| GET, PATCH, DELETE | `/api/admin/applications/{id}` | detail with status history / `{status?, note?, adminNotes?}` / delete with résumé |
| GET | `/api/admin/applications/{id}/resume` | résumé download (attachment) |
| GET | `/api/admin/applications/export.csv` | CSV with the list's filters (no résumés) |
| GET | `/api/admin/careers/summary` | dashboard counts |

## Configuration (backend environment variables)

| Variable | Default | |
| --- | --- | --- |
| `PORT` | `8080` | |
| `SPRING_PROFILES_ACTIVE=prod` + `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` | H2 file | PostgreSQL in production |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | comma-separated; only needed when the frontend is on another domain |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` | off | email each form submission and job application to `NOTIFY_EMAIL`, see below |
| `NOTIFY_EMAIL` | `rcolorsgroup@gmail.com` | comma-separated recipients of those emails |
| `NOTIFY_FROM` | `MAIL_USERNAME` | sender address; Gmail only sends from the signed-in account |
| `NOTIFY_WHATSAPP` | off | also send them on WhatsApp, as `phone:apikey` pairs, see below |
| `ADMIN_USERNAME` | empty (admin off) | the one admin's username |
| `ADMIN_PASSWORD_HASH` | empty (admin off) | BCrypt hash of the admin password, see below |
| `ADMIN_JWT_SECRET` | empty (admin off) | at least 32 bytes, e.g. `openssl rand -base64 48`; changing it signs the admin out |
| `ADMIN_PANEL_URL` | empty | admin panel URL for links in application emails, e.g. `https://rcolorsgroup.com/admin` |
| `CAREERS_ACK_EMAIL` | `false` | `true` also emails applicants a "we received your application" note |
| `SERVER_FORWARD_HEADERS_STRATEGY=framework` | off | set when the API runs behind a proxy, so rate limits see the real client IP |

### Form notifications

Every submission is saved in the database (see the admin panel) whether or not alerts are set up.

**Email (Gmail):** turn on 2-Step Verification for rcolorsgroup@gmail.com, create an
[App Password](https://myaccount.google.com/apppasswords), then set
`MAIL_HOST=smtp.gmail.com`, `MAIL_PORT=587`, `MAIL_USERNAME=rcolorsgroup@gmail.com` and
`MAIL_PASSWORD=<the 16-character app password>`.

**WhatsApp (CallMeBot, free):** from each phone that should get alerts, save +34 644 66 32 62
as a contact and send it the WhatsApp message `I allow callmebot to send me messages`. The
reply contains that phone's API key. Then set, for example,
`NOTIFY_WHATSAPP=916389144470:<key1>,919579662353:<key2>` (country code, no `+`).

If an alert fails, the backend logs a warning (`Could not email ...` / `Could not WhatsApp ...`)
and the form still succeeds.

### Admin login

There is one admin and no user table. Until all three `ADMIN_*` login variables are set
(and valid), admin login is off, the backend logs a warning, and the rest of the site
works as usual. Generate the password hash once:

```bash
cd backend
mvn -q compile exec:java -Dexec.mainClass=com.rcolorsgroup.auth.HashPassword   # asks for the password
# or, on macOS/Linux with Apache's htpasswd:
htpasswd -nbBC 12 "" 'your-password' | tr -d ':\n'
```

Put the output in `ADMIN_PASSWORD_HASH`, in single quotes in a shell (`$` is part of it).
Then sign in at `/admin/login`. Résumés are stored in the database, so back it up like
the rest of the data.

Frontend build variables (`frontend/.env`): `VITE_SITE_URL` (absolute URLs in social/SEO
tags) and `VITE_API_BASE_URL` (leave empty when the API is on the same origin).

## Deploy

**One server (simplest):** `docker build -t rcolors . && docker run -p 8080:8080 rcolors`.
Spring Boot serves the React build and sends every non-API path to `index.html`.

**Separate hosts:** deploy `frontend/dist` to a static host (Netlify, Vercel…) with a
rewrite of all paths to `/index.html`, set `VITE_API_BASE_URL` to the backend URL at
build time, and add the site's domain to `CORS_ALLOWED_ORIGINS` on the backend.
