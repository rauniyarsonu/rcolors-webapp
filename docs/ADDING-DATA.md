# Adding data to R Colors Estate

The estate portal (`/businesses/estate`) is driven entirely by data files.
Adding a city, a locality, a village, a listing, a project or an agent never
needs a change to a React component. The Spring Boot backend serves the data
(`GET /api/estate/cities`, `GET /api/estate/cities/<slug>`); restart it after
editing the files (or run it with `app.data-dir` pointing at the folder).

Run the `npm run …` commands below from `frontend/`.

```
backend/src/main/resources/data/estate/
  locations.json                 the location tree (states, cities, localities, towns, villages)
  cities/<city-slug>/
    properties.json              land and built property listings
    projects.json                projects
    agents.json                  agents / advisors
  templates/*.csv                CSV templates for bulk import
frontend/public/images/estate/<city-slug>/  photos for that city's records
frontend/src/config/estate/
  site.ts                        page settings (REQUIRE_CITY_SELECTION, page size, hero image, form)
  catalog.ts                     property types, statuses, project types, specializations
  filters.ts                     the filter sidebar and sort options
  units.ts                       area units, bigha/biswa sizes per state
```

After any change, run:

```bash
npm run validate:data
```

It prints every problem with the file name and record id. `npm run build` runs it
first (`prebuild`), so invalid data can't be deployed.

---

## 1. Add a city

```bash
npm run add-city -- --name "Kanpur" --state "Uttar Pradesh"
```

This:

- adds `kanpur` to `locations.json` with `"enabled": false` (creating the state if needed)
- creates `backend/src/main/resources/data/estate/cities/kanpur/{properties,projects,agents}.json` (empty)
- creates `frontend/public/images/estate/kanpur/`

Then add localities and records (below). When you are ready to show it, set
`"enabled": true` on the `kanpur` entry in `locations.json`.

**A city appears in the city dropdown only when it is enabled and has at least one record.**
It also gets its own page at `/businesses/estate/kanpur`, locality pages, trending
chips, locality counts, filters and SEO metadata, all automatically.

Options: `--slug kanpur-city` (custom slug), `--type town` (for a town-level market).

## 2. Add a locality

```bash
npm run add-locality -- --city lucknow --name "Gomti Nagar"
npm run add-locality -- --city lucknow --name "Gomti Nagar Extension" --aliases "GNE" --landmarks "Ekana Stadium" --nearby "gomti-nagar|shaheed-path"
```

- `--aliases` and `--landmarks` (separated by `|`) are matched by the search box.
- `--nearby` slugs power the "Show nearby" button when a locality has no listings.

## 3. Add a regional area (town, village, highway belt)

Regional areas are deeper nodes in the same tree, so filters, counts and search
treat them like any other area. Selecting a city includes all of them.

```bash
# a town on the outskirts of Lucknow
npm run add-locality -- --city lucknow --name "Mohanlalganj" --type town
# a village inside that town's area
npm run add-locality -- --city lucknow --name "<Village name>" --type village --parent mohanlalganj
```

A town or city **inside** another city is a regional area of that city, not a
separate dropdown entry. Only top-level cities/towns (directly under a state or
district) become dropdown options.

Slugs must be unique across all cities. If a village name repeats in another
district, the script adds the city slug (`rampur-lucknow`), or you can pass `--slug`.

## 4. Add properties and land

Either edit `cities/<city>/properties.json` or import a CSV (section 7).

```jsonc
{
  "id": "lko-p-011",                 // unique across all files
  "citySlug": "lucknow",             // must match the folder
  "locationSlug": "chinhat",         // any area inside the city
  "title": "East-facing plot on 30 ft road",
  "category": "land",                // land | property (must match the type)
  "type": "residential-plot",        // see frontend/src/config/estate/catalog.ts
  "price": 4500000,                  // rupees
  "priceUnit": "total",              // optional: total (default) | per-area (price per areaUnit)
  "areaValue": 150,
  "areaUnit": "sqyd",                // sqft | sqyd | sqm | acre | hectare | bigha | biswa
  "status": "ready",                 // ready | under-development
  "images": ["/images/estate/lucknow/lko-p-011-1.jpg"],
  "verified": true,
  "verifiedOn": "2026-10-01",        // required when verified is true
  "description": "…",
  "postedAt": "2026-10-05",
  "featured": false,                 // optional: shows first under "Recommended"
  "agentId": "lko-a-001",            // optional: must exist in agents.json
  "projectId": "lko-prj-002",        // optional: must exist in projects.json
  "attributes": {
    "facing": "east", "roadWidth": 30, "cornerPlot": true, "boundaryWall": true,
    "landUse": "Residential", "distanceFromHighway": 2, "titleDocsVerified": true
  }
}
```

Built-property attributes: `bhk`, `bathrooms`, `floor`, `totalFloors`,
`furnishing` (`unfurnished` | `semi-furnished` | `furnished`), `ageYears`, `possession`.

Land types: `residential-plot`, `agricultural-land`, `commercial-land`, `industrial-land`.
Property types: `apartment`, `independent-house`, `villa`, `builder-floor`, `shop`, `office`, `warehouse`.

**Never put owner names, phone numbers, Aadhaar/PAN, khasra/khatauni or other land-record numbers in these files.**
They are published on the website. The schema rejects unknown fields.

### Bigha and biswa

These units differ between states and districts. Their size in sq ft is set in
`frontend/src/config/estate/units.ts` → `REGIONAL_UNIT_SIZES`, per state, with optional
district overrides:

```ts
"uttar-pradesh": { bigha: 27000, biswa: 1350, districts: { sitapur: { bigha: 27225 } } },
```

A record in bigha in a state without a configured size fails validation.

## 5. Add projects

```jsonc
{
  "id": "lko-prj-007",
  "citySlug": "lucknow",
  "locationSlug": "shaheed-path",
  "name": "…",
  "developer": "…",
  "type": "residential",             // residential | commercial | plotted | mixed-use
  "status": "under-construction",    // upcoming | under-construction | ready
  "startingPrice": 7500000,
  "sizeRange": "2–4 BHK · 1,250–2,400 sq ft",
  "images": ["/images/estate/lucknow/lko-prj-007.jpg"],
  "description": "…",
  "reraId": "UPRERAPRJ…"             // optional, only if real
}
```

Listings with `"projectId"` appear under "See listings here" on the project.

## 6. Add agents

```jsonc
{
  "id": "lko-a-007",
  "name": "…",
  "role": "Property Advisor",
  "photo": "/images/estate/lucknow/agent-lko-a-007.jpg",   // optional
  "phone": "9876543210",              // 10-digit Indian mobile, no +91 or spaces
  "whatsapp": "9876543210",           // optional: shows the WhatsApp button
  "email": "name@example.com",        // optional
  "specializations": ["residential", "land"],   // residential | commercial | land | investment
  "areasServed": ["gomti-nagar", "chinhat"],    // use the city slug for city-wide agents
  "languages": ["Hindi", "English"]
}
```

## 7. Bulk import from a spreadsheet (CSV)

1. Copy a template from `backend/src/main/resources/data/estate/templates/` (`properties.csv`, `projects.csv`, `agents.csv`).
2. Fill one row per record. Lists (images, specializations, areasServed, languages) use `|`.
   Prices accept `4500000`, `45 L` or `1.2 Cr`. Yes/no columns accept `yes/no`, `true/false`, `1/0`.
   Blank `category` is filled from `type`, blank `postedAt` becomes today.
3. Export as CSV (UTF-8) and run:

```bash
npm run import:csv -- --city lucknow --type properties --file ~/Downloads/listings.csv
npm run import:csv -- --city lucknow --type properties --file listings.csv --dry-run   # check only
npm run import:csv -- --city lucknow --type agents --file agents.csv --replace         # replace the whole file
```

Rows with an existing `id` update that record; new ids are added. The whole dataset
is validated first and **nothing is written if anything is wrong**.

Property columns: `id, locationSlug, title, category, type, price, priceUnit, areaValue,
areaUnit, status, images, verified, verifiedOn, description, postedAt, featured, agentId,
projectId, isSample, facing, roadWidth, cornerPlot, boundaryWall, landUse,
distanceFromHighway, titleDocsVerified, bhk, bathrooms, floor, totalFloors, furnishing,
ageYears, possession`

Project columns: `id, locationSlug, name, developer, type, status, startingPrice, sizeRange,
images, description, reraId, featured, isSample`

Agent columns: `id, name, role, photo, phone, whatsapp, email, specializations, areasServed,
languages, featured, isSample`

## 8. Images

- Put photos in `frontend/public/images/estate/<city-slug>/` and reference them as
  `/images/estate/<city-slug>/<file>.jpg` (jpg, png, webp or avif).
- Landscape 4:3 or 16:9, at least 1600 px wide, under ~500 KB (they are served as-is, so compress them).
- Name files after the record id: `lko-p-011-1.jpg`, `lko-p-011-2.jpg`.
- Records without images show a branded "Photos coming soon" placeholder.
- `validate:data` fails if a referenced image doesn't exist.

## 9. Sample data

Seed records carry `"isSample": true` and a `[SAMPLE]` title/name prefix
(validation enforces both together). In development a banner shows how many
are on screen. `npm run validate:data` prints how many remain. Delete or replace
them before launch.

Locations marked `"toConfirm": true` were suggested during development. Keep
the ones where R Colors sells, delete the rest (or set `"enabled": false`).

## 10. Other changes without touching components

| Change | Where |
| --- | --- |
| New property type / status / project type / specialization | `frontend/src/config/estate/catalog.ts` |
| New filter, or change a filter's segments | `frontend/src/config/estate/filters.ts` |
| New sort option | `SORTS` in `frontend/src/config/estate/filters.ts` |
| Area units shown per category, bigha sizes | `frontend/src/config/estate/units.ts` |
| Hide results until a city is picked | `REQUIRE_CITY_SELECTION` in `frontend/src/config/estate/site.ts` |
| Hero photo | `heroImage` in `frontend/src/config/estate/site.ts` |
| Move data to a database / CMS | change `EstateService` in the backend; the API response shape (`CityBundle`) stays the same |

## 11. URLs

Every search is a shareable link. Defaults are omitted:

```
/businesses/estate                         hub (first enabled city)
/businesses/estate/lucknow                 city page (canonical)
/businesses/estate/lucknow/gomti-nagar     locality landing page (areas with listings/projects)

?tab=buy|projects|agents
&category=land|residential|commercial      Buy segment
&loc=gomti-nagar,chinhat                   areas (includes everything inside them)
&q=corner                                  keyword
&type=residential-plot,apartment           property types
&min=2500000&max=10000000                  budget (₹)
&amin=100&amax=300&unit=sqyd               area range and unit
&status=ready  &bhk=2,3  &facing=east  &road=30&roadMax=60  &corner=1  &verified=1
&ptype=plotted&pstatus=upcoming&pmin=…&pmax=…   Projects tab
&spec=land&name=…                          Agents tab
&sort=recommended|newest|price-asc|price-desc|area-desc|locality|name
&view=<listing or project id>              opens the detail view
```

## 12. Enquiries

The enquiry form posts to the backend (`POST /api/estate/enquiries`), which saves
it in the `estate_enquiry` table. The contact page form works the same way
(`POST /api/contact`, table `contact_message`). To also receive each submission
by email, set `NOTIFY_EMAIL` and the `MAIL_*` settings described in
`backend/src/main/resources/application.properties`.

## 13. Managing careers

Jobs and applications live in the database, not in data files, and are managed in the
admin panel at `/admin` (sign-in setup: README > Configuration > Admin login).

- **Post a job:** Jobs → New job. "Save as draft" keeps it private; "Publish" puts it on
  `/careers` straight away. Use Preview to see the public page before publishing.
  Descriptions are plain text (blank line = new paragraph); responsibilities,
  requirements, nice-to-haves and benefits are one row each and can be reordered.
- **Salary** is only shown publicly when "Show salary on the careers page" is ticked.
- **Deadline:** the last day to apply. After it the job drops off the list and its page
  says it's closed, without you changing anything.
- **Close / reopen:** a closed job stops taking applications but its link still works.
  **Archive** removes it from the site entirely (applications are kept). Only a draft
  that nobody applied to can be deleted.
- **The URL** (`/careers/site-engineer-civil`) is made from the first title and stays the
  same when you rename the job, so shared links keep working. Duplicate a job to reuse it.
- **Applications:** filter by job, status, date or name/email/phone; change the status
  from the list or the detail page (with an optional note, kept in the history); add
  private notes; download the résumé; Export CSV downloads what the filters show.
- **Data removal:** if a candidate asks to be deleted, open the application and use
  "Delete application". It removes the application, its résumé and its history.
- **Copy on the careers page** (intro, perks, empty state, labels) is in
  `frontend/src/config/careers.ts`.
