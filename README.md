# R Colors Group website

React (Vite + TypeScript + Tailwind) frontend and Spring Boot (Java 21) backend.

```
frontend/   React app: pages, components, styles, images (public/), estate data scripts
backend/    Spring Boot API: content + estate data, contact/enquiry forms, database
docs/       ADDING-DATA.md: how to add cities, localities, listings, projects, agents
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

Invalid form posts get `400 {"errors": {"field": "message"}}`.

## Configuration (backend environment variables)

| Variable | Default | |
| --- | --- | --- |
| `PORT` | `8080` | |
| `SPRING_PROFILES_ACTIVE=prod` + `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` | H2 file | PostgreSQL in production |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | comma-separated; only needed when the frontend is on another domain |
| `NOTIFY_EMAIL`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` | off | email each form submission |

Frontend build variables (`frontend/.env`): `VITE_SITE_URL` (absolute URLs in social/SEO
tags) and `VITE_API_BASE_URL` (leave empty when the API is on the same origin).

## Deploy

**One server (simplest):** `docker build -t rcolors . && docker run -p 8080:8080 rcolors`.
Spring Boot serves the React build and sends every non-API path to `index.html`.

**Separate hosts:** deploy `frontend/dist` to a static host (Netlify, Vercel…) with a
rewrite of all paths to `/index.html`, set `VITE_API_BASE_URL` to the backend URL at
build time, and add the site's domain to `CORS_ALLOWED_ORIGINS` on the backend.
