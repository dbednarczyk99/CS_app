# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Chleba Smak: the website and admin panel for a bakery. A monorepo with three independent npm packages (each has its own `package.json` and lockfiles; there is no root package):

- `backend/`: NestJS 11 REST API, Prisma 6 ORM, MySQL
- `frontend/`: React 19 and Vite admin panel built on **react-admin** 5
- `web/`: public website (Next.js 15 App Router, Tailwind 4). Multi-page (/, /oferta, /oferta/[id], /piekarnie, /chlebowoz, /o-nas, /aktualnosci, /kontakt); server components fetch from the API with 60 s ISR via [web/src/lib/api.ts](web/src/lib/api.ts). Premium dark design derived from the first static site (`C:/git-repos/chleba-smak_1v`): graphite/ink backgrounds, cream text, gold accent, Oswald uppercase headings + Lato body; design tokens and `.btn`/`.eyebrow`/`.heading` classes live in [globals.css](web/src/app/globals.css). Site photos are in `web/public/images`; product/blog seed photos are in `backend/uploads/seed` (resized from that repo)

Code comments and some UI strings are in Polish.

Project goals, scope (bread reservations with pay-on-pickup, no customer accounts), open decisions and roadmap are in [docs/ZALOZENIA.md](docs/ZALOZENIA.md) (in Polish). Read it before planning new features.

## Commands

Local infrastructure: MySQL 8 on host port **3307** (db `chleba_smak_dev`, user `dev`/`dev`; 3306 is taken by a separate local MySQL service on this machine), Adminer on :8080 and Mailpit (catches all outgoing mail; SMTP :1025, inbox UI http://localhost:8025).
```bash
docker compose up -d
```

Backend (`cd backend`), API on http://localhost:3000:
```bash
npm run start:dev                  # watch mode
npm run build                      # nest build -> dist/
npm run lint                       # eslint --fix
npm run format                     # prettier
npm test                           # jest unit tests (*.spec.ts under src/)
npx jest src/path/to/file.spec.ts  # single test file
npx jest -t "test name"            # single test by name
npm run test:e2e                   # test/jest-e2e.json
npx prisma migrate dev --name <name>  # after editing prisma/schema.prisma
npx prisma generate
npx prisma db seed                 # runs prisma/seed.ts (wipes and re-inserts data)
```

Frontend (`cd frontend`), dev server on http://localhost:5173:
```bash
npm run dev
npm run build    # tsc -b && vite build
npm run lint
```

Public site (`cd web`), dev server on http://localhost:3001:
```bash
npm run dev
npm run build
npm run lint
```

## Environment

- `backend/.env`: `DATABASE_URL` (mysql), optional `PORT`, `JWT_SECRET` (falls back to a dev-only default with a warning), `CORS_ORIGINS` (comma-separated; defaults to :5173 and :3001), `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS`/`MAIL_FROM` (mail is only logged when `SMTP_HOST` is unset), `WEB_URL` (public site URL used in e-mail links), `SUMMARY_EMAIL` + `DAILY_SUMMARY_ENABLED` (18:30 preparation e-mail, off by default), `ADMIN_URL`, `CONTACT_EMAIL` (recipient of the website contact form – no fallback to the e-mail from the panel; when unset the form returns 503; locally a fake `.test` address caught by Mailpit), `RESERVATION_RETENTION_MONTHS` (default 6; customer data in older reservations is anonymized daily at 03:00), `REVALIDATE_SECRET` (when set, every successful non-GET request by a logged-in user triggers `POST {WEB_URL}/api/revalidate` so the site shows panel changes immediately instead of after the 60 s ISR window; `web/.env.local` needs the same value)
- `frontend/.env`: `VITE_API_URL` (defaults to `http://localhost:3000`)
- `web/.env.local`: `API_URL` (defaults to `http://localhost:3000`; also whitelisted for next/image in [next.config.ts](web/next.config.ts))
- Google Maps: `web/.env.local` `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` + `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` (map on /piekarnie and /chlebowoz, [StoresMap.tsx](web/src/components/StoresMap.tsx); Map ID must use the cloud style imported from [docs/mapa-styl.json](docs/mapa-styl.json)); `frontend/.env` `VITE_GOOGLE_MAPS_API_KEY` for the admin "Uzupełnij z adresu" geocoding button. Without a key the site shows a placeholder. `Location` and `BreadVanLocation` have nullable `lat`/`lng`; points without them are not shown on the map
- Seed: `API_PUBLIC_URL` (defaults to `http://localhost:3000`) is baked into seeded image URLs
- Seeded staff accounts: `admin`/`admin123`, `editor`/`editor123`, `blogger`/`blogger123`, `viewer`/`viewer123`

## Backend architecture

- Feature modules live in `backend/src/modules/<feature>/` (products and categories, blog and tags, bread-van, contact/contact-info, contact/locations, auth). Each module has a controller, a service and `dto/`. Nested features (e.g. `blog/tags`, `contact/*`) are separate Nest modules, and each one is registered directly in [app.module.ts](backend/src/app.module.ts).
- There is no shared PrismaModule. Each feature module lists `PrismaService` in its own `providers`, so a new module must do the same.
- **Auth:** a global `AuthGuard` ([auth.guard.ts](backend/src/modules/auth/auth.guard.ts), registered as `APP_GUARD`) requires a staff JWT on every route. Mark read endpoints with `@Public()` and restrict writes with `@Roles(...)`, usually at class level with `CONTENT_ROLES` or `BLOG_ROLES` from [auth.decorators.ts](backend/src/modules/auth/auth.decorators.ts). Staff tokens carry `typ: 'staff'`; future customer tokens must use a different `typ`. `POST /auth/register` is ADMIN-only.
- **Validation:** a global `ValidationPipe({ whitelist: true, transform: true })` strips any body field without a class-validator decorator. When the admin panel sends a new field, add it to the DTO or it will silently disappear.
- **Image handling:** `POST /upload` ([upload.controller.ts](backend/src/modules/upload/upload.controller.ts)) uses multer to write files to `backend/uploads/` and returns an absolute URL. The files are served statically at `/uploads`. Entities store full image URLs (`imgUrl`) plus an `order` field in their own image tables (`ProductImages`, `ArticleImages`, `BreadVanImages`). When an image is removed or replaced, services call `deleteImageFiles()` from [scripts/imageHandler.ts](backend/src/scripts/imageHandler.ts) to unlink the files from disk.
- `BreadVanDescription` is a singleton resource (`GET/PATCH /bread-van/description`, no id).
- The Prisma schema is [backend/prisma/schema.prisma](backend/prisma/schema.prisma); migrations are in `prisma/migrations/`. The seed script uses `tsconfig.seed.json`.

## Reservations

Bread reservations (pay on pickup, no customer accounts) span all three apps:
- **API** ([backend/src/modules/reservations](backend/src/modules/reservations)): rules live in `reservation-rules.ts` and are computed in Europe/Warsaw time (order and cancel until 18:00 the day before pickup, max 5 days ahead, bakery slots from opening hours, van only on its stop day). Public routes: `GET /reservations/options`, `POST /reservations`, `GET|POST /reservations/cancel/:token`. Admin: list with filters, `GET /reservations/summary?date=`, `POST /reservations/summary/send`, `POST /reservations/:id/anonymize`. Numbers are `CODE-YYMMDD-NN` (e.g. `WIL-261017-03`; `Location.code` or derived from the street, `BUS` for the van), globally unique. Only two statuses (`NEW`, `CANCELLED`); staff cannot change them (admin shows reservations read-only) – only the customer cancels via the e-mailed link. Cron jobs (`@nestjs/schedule`, Europe/Warsaw) live in `reservations.jobs.ts`. Item prices are snapshotted; `Product.isReservable` controls what can be reserved, and seasonal products (`isSeasonal`) are reservable only while `inSeason` (out-of-season ones stay visible on the site in a muted “Wrócą w sezonie” section – helpers in `web/src/lib/products.ts`). Static routes are declared before `:id` in the controller.
- **E-mail:** global `MailService` (nodemailer over SMTP) sends in the background so mail failures never block a reservation. Templates are in `reservation-emails.ts`.
- **Web:** the basket lives in localStorage ([reservation-cart.tsx](web/src/lib/reservation-cart.tsx)); pages are `/rezerwacja` and `/rezerwacja/anuluj/[token]`. The browser calls Next route handlers under `web/src/app/api/rezerwacje`, which proxy to the API.
- **Privacy:** `RESERVATION_RETENTION_MONTHS` after creation reservations are **anonymized** (customer data cleared, items/dates kept for stats), also on demand via `POST /reservations/:id/anonymize` (admin button). The form asks only for a first name; the checkbox is acceptance of the terms, not GDPR consent.
- **Legal pages:** `/regulamin` and `/polityka-prywatnosci` render Markdown from `web/content/prawne/*.md` (single source; `[[…]]` = placeholder, highlighted) via the tiny renderer in [web/src/lib/markdown.tsx](web/src/lib/markdown.tsx). Notes for the lawyer: [docs/prawne/notatka-dla-prawnika.md](docs/prawne/notatka-dla-prawnika.md). E-mails load Oswald/Lato from `web/public/fonts` (CORS header in next.config), never from Google Fonts.
- **Admin:** the read-only `reservations` resource (list + show, no edit) and the `/przygotowanie` custom page (daily preparation summary). The data provider passes list filters to the API as query parameters for this resource.

## Announcement banner

- **API:** `backend/src/modules/announcements` – `Announcement` model (message ≤160, optional `linkUrl` starting with `/` or `https://`, `linkLabel`, `isActive`, optional `startsAt`/`endsAt` window, `order`). Public `GET /announcements/active`; CRUD for `CONTENT_ROLES`.
- **Web:** the root layout fetches active announcements, sets `html[data-banner]` and passes them to `Header`, which renders `AnnouncementBar` under the nav row (stays visible while scrolling, collapses only with the mobile menu open; rotates several messages, dismissal kept in sessionStorage per id+updatedAt). `--banner-h` (globals.css) reserves space; pages below the fixed header use the `pt-header` utility instead of fixed top padding.
- **Admin:** "Baner informacyjny" (`announcements` resource) with live preview and a blog-post picker that fills `linkUrl`.

## Frontend architecture

- [App.tsx](frontend/src/App.tsx) registers react-admin `<Resource>`s whose names are backend URL paths (e.g. `products/categories`, `contact/info`, `bread-van/locations`).
- [dataProvider.ts](frontend/src/dataProvider.ts) is a **custom** DataProvider (not `ra-data-simple-rest`). It maps resources to REST calls and has special cases:
  - The `locations` resource maps to `/contact/locations` and `/contact/location/:id`. App.tsx registers `contact/locations`, which bypasses this case and uses the generic path.
  - The `bread-van/description` singleton
  - `products` and the bread-van description go through `preparePayload()`, which uploads new image files (`rawFile`) to `/upload` first and then sends `images: [{ imgUrl, order }]`. When reading, it maps `imgUrl` to `src` for the image inputs.
  - `getManyReference`, `updateMany` and `deleteMany` are no-op stubs. Lists are not paginated server-side; the provider returns `total = data.length`.
  - When adding a resource whose endpoints don't follow `/<resource>[/:id]`, or that has images, add a special case here.
- [authProvider.ts](frontend/src/authProvider.ts) stores the JWT in `localStorage.token`, and `httpClient` sends it as a Bearer header.
- Resource screens are in `src/admin/components/`. Shared inputs such as `SortableImageInput` (drag-and-drop image ordering with @dnd-kit) and `TagInput` are in `src/admin/common/`.
