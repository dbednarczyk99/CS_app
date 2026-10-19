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
- Google Maps: `web/.env.local` `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` + `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` (map on /piekarnie and /chlebowoz, [StoresMap.tsx](web/src/components/StoresMap.tsx); reservation form minimap + point list per chosen day, [PickupPointPicker.tsx](web/src/components/PickupPointPicker.tsx) – flow: day → point → estimated time (every 30 min, last slot 30 min before closing / van departure), last point remembered in localStorage after a successful reservation; Map ID must use the cloud style imported from [docs/mapa-styl.json](docs/mapa-styl.json)); `frontend/.env` `VITE_GOOGLE_MAPS_API_KEY` for the admin "Uzupełnij z adresu" geocoding button. Without a key the site shows a placeholder. `Location` and `BreadVanLocation` have nullable `lat`/`lng`; points without them are not shown on the map
- Seed: `API_PUBLIC_URL` (defaults to `http://localhost:3000`) is baked into seeded image URLs
- Seeded staff accounts: `admin`/`admin123` (owner, ADMIN) and `social`/`social12345` (content, EDITOR). Emergency password reset on the server: `cd backend && npm run haslo -- <login> ["<new password>"]` (random password printed when omitted; creates an ADMIN account if the login doesn't exist; invalidates the account's sessions)

## Backend architecture

- Feature modules live in `backend/src/modules/<feature>/` (products and categories, blog and tags, bread-van, contact/contact-info, contact/locations, auth). Each module has a controller, a service and `dto/`. Nested features (e.g. `blog/tags`, `contact/*`) are separate Nest modules, and each one is registered directly in [app.module.ts](backend/src/app.module.ts).
- There is no shared PrismaModule. Each feature module lists `PrismaService` in its own `providers`, so a new module must do the same.
- **Auth:** a global `AuthGuard` ([auth.guard.ts](backend/src/modules/auth/auth.guard.ts), registered as `APP_GUARD`) requires a staff JWT on every route. Mark read endpoints with `@Public()` and restrict writes with `@Roles(...)`, usually at class level with `CONTENT_ROLES` or `BLOG_ROLES` from [auth.decorators.ts](backend/src/modules/auth/auth.decorators.ts). Staff tokens carry `typ: 'staff'` and `tv` (the user's `tokenVersion`); future customer tokens must use a different `typ`. The guard loads the user on every request, so deleting an account, changing its role or password takes effect immediately (password changes bump `tokenVersion`). Two roles are used: **ADMIN** = owner (everything; `OWNER_ROLES`/`RESERVATION_ROLES` – reservations, the newsletter subscriber list, accounts) and **EDITOR** = content (products, bakeries, van, blog, banner, social links; sees only `GET /newsletter/stats`). BLOGGER/VIEWER remain in the enum but the panel doesn't offer them. Accounts: `GET/POST/PATCH/DELETE /users` (ADMIN; can't delete or demote yourself, at least one ADMIN must remain; passwords ≥ 10 chars), `GET /auth/me`, `PATCH /auth/me/password` (returns a fresh token). Login is limited to 10 failed attempts per IP per 15 min (in memory, by connection IP – not `X-Forwarded-For`). The admin hides owner-only resources/menu items via `getPermissions` (role decoded from the JWT).
- **Validation:** a global `ValidationPipe({ whitelist: true, transform: true })` strips any body field without a class-validator decorator. When the admin panel sends a new field, add it to the DTO or it will silently disappear.
- **Image handling:** `POST /upload` ([upload.controller.ts](backend/src/modules/upload/upload.controller.ts)) uses multer to write files to `backend/uploads/` and returns an absolute URL. The files are served statically at `/uploads`. Entities store full image URLs (`imgUrl`) plus an `order` field in their own image tables (`ProductImages`, `ArticleImages`, `BreadVanImages`). When an image is removed or replaced, services call `deleteImageFiles()` from [scripts/imageHandler.ts](backend/src/scripts/imageHandler.ts) to unlink the files from disk.
- `BreadVanDescription` is a singleton resource (`GET/PATCH /bread-van/description`, no id).
- The Prisma schema is [backend/prisma/schema.prisma](backend/prisma/schema.prisma); migrations are in `prisma/migrations/`. The seed script uses `tsconfig.seed.json`.

## Reservations

Bread reservations (pay on pickup, no customer accounts) span all three apps:
- **API** ([backend/src/modules/reservations](backend/src/modules/reservations)): rules live in `reservation-rules.ts` and are computed in Europe/Warsaw time (order and cancel until 18:00 the day before pickup, max 5 days ahead, bakery slots from opening hours, van only on its stop day). Public routes: `GET /reservations/options`, `POST /reservations`, `GET|POST /reservations/cancel/:token`. Admin: list with filters, `GET /reservations/summary?date=`, `POST /reservations/summary/send`, `POST /reservations/:id/anonymize`. Numbers are `CODE-YYMMDD-NN` (e.g. `WIL-261017-03`; `Location.code` or derived from the street, `BUS` for the van), globally unique. Only two statuses (`NEW`, `CANCELLED`); staff cannot change them (admin shows reservations read-only) – only the customer cancels via the e-mailed link. Cron jobs (`@nestjs/schedule`, Europe/Warsaw) live in `reservations.jobs.ts`. Item prices are snapshotted; `Product.isReservable` controls what can be reserved, and seasonal products (`isSeasonal`) are reservable only while `inSeason` (out-of-season ones stay visible on the site in a muted “Wrócą w sezonie” section – helpers in `web/src/lib/products.ts`). `/oferta` filters: `?kategorie=<id>,<id>` and `?etykiety=promocje,nowosci,<label slug>,sezonowe` – both multi-select (OR within a filter, AND between them; legacy `?kategoria=` and `?sezonowe` still work). Categories come from active products, so a new category appears once it has a product. Desktop shows toggle chips, mobile two `DropdownPanel`s with square checkboxes (“Kategorie”, “Wyróżnione”). Static routes are declared before `:id` in the controller.
- **E-mail:** global `MailService` (nodemailer over SMTP) sends in the background so mail failures never block a reservation. Templates are in `reservation-emails.ts`.
- **Web:** the basket lives in localStorage ([reservation-cart.tsx](web/src/lib/reservation-cart.tsx)); pages are `/rezerwacja` and `/rezerwacja/anuluj/[token]`. The browser calls Next route handlers under `web/src/app/api/rezerwacje`, which proxy to the API.
- **Privacy:** `RESERVATION_RETENTION_MONTHS` after creation reservations are **anonymized** (customer data cleared, items/dates kept for stats), also on demand via `POST /reservations/:id/anonymize` (admin button). The form asks only for a first name; the checkbox is acceptance of the terms, not GDPR consent.
- **Legal pages:** `/regulamin` and `/polityka-prywatnosci` render Markdown from `web/content/prawne/*.md` (single source; `[[…]]` = placeholder, highlighted) via the tiny renderer in [web/src/lib/markdown.tsx](web/src/lib/markdown.tsx). Notes for the lawyer: [docs/prawne/notatka-dla-prawnika.md](docs/prawne/notatka-dla-prawnika.md). E-mails load Oswald/Lato from `web/public/fonts` (CORS header in next.config), never from Google Fonts.
- **Admin:** the read-only `reservations` resource (list + show, no edit) and the `/przygotowanie` custom page (daily preparation summary). The data provider passes list filters to the API as query parameters for this resource.

## Newsletter

- **API:** `backend/src/modules/newsletter` – `NewsletterSubscriber` (email, `PENDING | CONFIRMED | UNSUBSCRIBED`, random `token`, consent/confirm/unsubscribe dates). Double opt-in: public `POST /newsletter/subscribe` (always `{ok:true}`, honeypot, 5 per IP / 15 min) sends a confirmation e-mail; `POST /newsletter/confirm` and `POST /newsletter/unsubscribe` take `{token}` (POST on purpose – mail scanners open GET links). Cron 3:30 removes PENDING older than 7 days. Admin: `GET /newsletter`, `DELETE /newsletter/:id`. Blog posts are the newsletter: `Article.sendAsNewsletter` (default true in the admin form) makes `BlogService` call `NewsletterService.sendArticle` after create/update – sent once (atomic claim on `newsletterSentAt`, `newsletterRecipients` stored), one e-mail per CONFIRMED subscriber with its own unsubscribe link and a `List-Unsubscribe` header. Existing articles were set to `sendAsNewsletter = false` by the migration so editing them never mails anyone. `Article.isPublished = false` makes a newsletter-only post: public `GET /blog` and `/blog/:id` return only published posts, the admin reads `GET /blog/admin/all` and `/blog/admin/:id` (dataProvider routes `blog` there), and the e-mail carries the full content instead of a “Czytaj dalej” link. The admin form asks for confirmation (NewsletterSaveToolbar) before a save that sends.
- **Web:** one `NewsletterDialog` (native `<dialog>`, dimmed backdrop) mounted in the root layout; opened by `openNewsletter()`/`NewsletterButton`, by any `a[href="#newsletter"]` (announcement links may be `#newsletter`) or by visiting a URL with `#newsletter`. Entry points: announcement bar, footer, `/kontakt` below the form. E-mail links land on `/newsletter/potwierdz/[token]` and `/newsletter/wypisz/[token]` (button → `/api/newsletter/[akcja]` proxy).
- E-mail helpers (`layout`, `button`, …) are exported from `reservations/reservation-emails.ts`; `layout` takes an optional footer note.

## Announcement banner

- **API:** `backend/src/modules/announcements` – `Announcement` model (message ≤160, optional `linkUrl` starting with `/` or `https://`, `linkLabel`, `isActive`, optional `startsAt`/`endsAt` window, `order`). Public `GET /announcements/active`; CRUD for `CONTENT_ROLES`.
- **Web:** the root layout fetches active announcements, sets `html[data-banner]` and passes them to `Header`, which renders `AnnouncementBar` under the nav row (stays visible while scrolling, collapses only with the mobile menu open; rotates several messages, dismissal kept in sessionStorage per id+updatedAt). `--banner-h` (globals.css) reserves space; pages below the fixed header use the `pt-header` utility instead of fixed top padding.
- **Admin:** "Baner informacyjny" (`announcements` resource) with live preview and a blog-post picker that fills `linkUrl`.

## Marketing (labels, promotions, scheduling, stats)

- **Product labels:** `ProductLabel` (name, `slug` fixed at creation = `/oferta?etykiety=<slug>` filter key, `color` gold|cream|dark|green|red, `order`, optional `activeFrom`/`activeTo` YYYY-MM-DD) ↔ `Product.labels` (implicit m2m; the panel sends `labelIds`, the dataProvider maps `labels` → `labelIds`). `system = 'promo'` is the fixed “Promocja” label: editable (name/colour/order), not deletable, never assigned manually (`assignableLabelIds` filters it; the panel lists `products/labels` with `filter.assignable`). Product responses add `labels[].active` (date window) and `promoLabel`. Web: `labelsOf`, `labelFilters`, `BADGE_STYLE` in `web/src/lib/products.ts`.
- **Promotions:** `Product.isPromo`, `promoPrice?`, `promoFrom/promoTo` (Warsaw days, inclusive). API adds `promoActive` and `currentPrice` ([promo.ts](backend/src/modules/products/promo.ts)). Reservations price items by the **pickup date** (`currentPrice(p, pickupDate)`); the reservation form recomputes prices per chosen day and warns when pickup falls outside the promo. Every change is mirrored to `PromoPeriod` (history for “Skuteczność promocji”). The fixed announcement `Announcement.system = 'promo'` is returned by `/announcements/active` only while any visible product has an active promo (no dates, not deletable).
- **Product scheduling:** `Product.availableFrom` / `unavailableFrom` (YYYY-MM-DD, Warsaw time, applied from the start of that day; both on the same day are rejected). `ProductsService.applySchedule` (cron every minute) flips the toggles – available: `isActive = true` (+ `inSeason = true` for seasonal); unavailable: seasonal `inSeason = false`, others `isActive = false` – and clears the applied date, so the toggles stay the only state. The article form warns (`ArticleProductTools`) when a tile's product won't be visible / in season or its promo won't run at the article's publish time.
- **Blog scheduling:** `Article.publishAt` hides the post (public `GET /blog*` use `visibleNow()`) and delays the newsletter until then; a per-minute cron in `BlogService.sendScheduled` sends due newsletters. Public responses add `publishedAt` (= `publishAt ?? createdAt`), which the site uses for dates and sorting.
- **Product tiles:** a paragraph `[produkt:<uuid> Name]` in `Article.content` renders as `ProductTile` on the article page and as an e-mail tile ([product-tiles.ts](backend/src/modules/newsletter/product-tiles.ts)); published-post newsletters list the tiles under the teaser. Panel: `ArticleProductTools` (insert tile / current promotions, `POST /newsletter/preview` e-mail preview without sending).
- **Dashboard:** the panel home page is role-based – the owner sees reservation/newsletter cards, then the “Marketing” overview ([MarketingOverview.tsx](frontend/src/admin/pages/MarketingOverview.tsx), `GET /stats/marketing`: active/scheduled promotions, scheduled posts, scheduled product changes, dated labels within 14 days, last newsletter, top products of 7 days); EDITOR sees the overview directly. Menu groups: Rezerwacje · Oferta · Marketing · Piekarnie (Piekarnie, Chlebowóz – one screen with tabs Trasa | Opis i zdjęcia) · Kontakt · Ustawienia (the CMS branch will add a “Strona” group).
- **Stats:** metrics `product` (product page views, key = product id) and `newsletter` (key `articleId|wpis` or `articleId|productId`, from `utm_source=newsletter&utm_campaign=<articleId>&utm_content=<productId>` links in e-mails; `DailyStat.key` is 100 chars). `GET /stats` adds `products`, `newsletters`, `promotions` (reserved quantity by pickup date and views during vs the equally long period before) – also for EDITOR.
- **Google rating:** `Location.googlePlaceId` → “Oceń nas w Google” link (`search.google.com/local/writereview?placeid=`) on `/piekarnie`; with `GOOGLE_PLACES_API_KEY` in the backend env, `LocationsService` fetches `rating,userRatingCount` (Places API New, Place Details Enterprise – 1000 free calls/month) daily at 6:15 and after the ID changes.

## Frontend architecture

- [App.tsx](frontend/src/App.tsx) registers react-admin `<Resource>`s whose names are backend URL paths (e.g. `products/categories`, `contact/info`, `bread-van/locations`).
- [dataProvider.ts](frontend/src/dataProvider.ts) is a **custom** DataProvider (not `ra-data-simple-rest`). It maps resources to REST calls and has special cases:
  - The `locations` resource maps to `/contact/locations` and `/contact/location/:id`. App.tsx registers `contact/locations`, which bypasses this case and uses the generic path.
  - The `bread-van/description` singleton
  - `products` and the bread-van description go through `preparePayload()`, which uploads new image files (`rawFile`) to `/upload` first and then sends `images: [{ imgUrl, order }]`. When reading, it maps `imgUrl` to `src` for the image inputs.
  - `getManyReference` and `updateMany` are no-op stubs; `deleteMany` deletes the selected records one by one. The API returns whole lists, so generic `getList` sorts (any field except `id`, which keeps the API order) and paginates in the panel; `reservations` is filtered by the API instead.
  - When adding a resource whose endpoints don't follow `/<resource>[/:id]`, or that has images, add a special case here.
- [authProvider.ts](frontend/src/authProvider.ts) stores the JWT in `localStorage.token`, and `httpClient` sends it as a Bearer header.
- **Statistics** (`/statystyki`; the owner sees everything, EDITOR only traffic – views, sources, top pages; `GET /stats` strips the rest server-side by role): [StatsPage.tsx](frontend/src/admin/pages/StatsPage.tsx) reads `GET /stats?days=` ([backend/src/modules/stats](backend/src/modules/stats)). Counters live in `DailyStat` (date in Warsaw time, metric `view | map | mail | mail_failed`, key, count; no personal data): the site sends page views ([PageViewTracker](web/src/components/PageViewTracker.tsx), path normalised by `pageKey` in `web/src/lib/stats.ts`) and Google map instances ([MapLoadCounter](web/src/components/MapLoadCounter.tsx), once per map) via `POST /api/statystyki` → public `POST /stats/event` (allowed keys only, bots/headless browsers ignored, 300 events / 10 min per IP in memory); `MailService` counts every sent/failed e-mail by `MailMessage.category`. Plan limits and the maps price come from `STATS_EMAIL_DAILY_LIMIT` (100), `STATS_EMAIL_MONTHLY_LIMIT` (3000), `STATS_MAPS_MONTHLY_FREE` (10000), `STATS_MAPS_PRICE_USD` (7 per 1000), `STATS_USD_PLN` (3.9). The seed adds 60 days of fictional counters ([seed-stats.ts](backend/prisma/seed-stats.ts)).
- **Look and language:** [theme.ts](frontend/src/theme.ts) mirrors the site (ink/coal/cream/gold, Oswald headings and buttons, Lato text; fonts self-hosted via `@fontsource`), dark by default with a light variant; the app bar is always dark with the white logo. [i18n.ts](frontend/src/i18n.ts) holds the full Polish translation of react-admin messages (plural forms 1 |||| 2–4 |||| 5+) and the resource/field names – give new fields a label there or in the component. Custom login page ([LoginPage.tsx](frontend/src/admin/common/LoginPage.tsx)), layout with logo ([AdminLayout.tsx](frontend/src/admin/common/AdminLayout.tsx)), Polish weekday names in [weekdays.ts](frontend/src/admin/common/weekdays.ts). The dashboard shows today's/tomorrow's reservation counts (from `/reservations/summary`) and confirmed newsletter subscribers; `VITE_WEB_URL` (default `http://localhost:3001`) is the “Otwórz stronę piekarni” link. Print styles in `src/index.css` make `/przygotowanie` print black on white in either theme.
- Resource screens are in `src/admin/components/`. Shared inputs such as `SortableImageInput` (drag-and-drop image ordering with @dnd-kit) and `TagInput` are in `src/admin/common/`.
