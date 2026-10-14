# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Chleba Smak: the website and admin panel for a bakery. A monorepo with three independent npm packages (each has its own `package.json` and lockfiles; there is no root package):

- `backend/`: NestJS 11 REST API, Prisma 6 ORM, MySQL
- `frontend/`: React 19 and Vite admin panel built on **react-admin** 5
- `web/`: public website (Next.js 15 App Router, Tailwind 4). Multi-page (/, /oferta, /oferta/[id], /piekarnie, /chlebowoz, /o-nas, /aktualnosci, /kontakt); server components fetch from the API with 60 s ISR via [web/src/lib/api.ts](web/src/lib/api.ts). Premium dark design derived from the first static site (`C:/git-repos/chleba-smak_1v`): graphite/ink backgrounds, cream text, gold accent, Oswald uppercase headings + Lato body; design tokens and `.btn`/`.eyebrow`/`.heading` classes live in [globals.css](web/src/app/globals.css). Site photos are in `web/public/images`; product/blog seed photos are in `backend/uploads/seed` (resized from that repo)

Code comments and some UI strings are in Polish.

Project goals, scope, planned architecture (public Next.js storefront in `web/`, customer accounts, per-store stock, orders and payments) and roadmap are in [docs/ZALOZENIA.md](docs/ZALOZENIA.md) (in Polish). Read it before planning new features.

## Commands

Local infrastructure: MySQL 8 on host port **3307** (db `chleba_smak_dev`, user `dev`/`dev`; 3306 is taken by a separate local MySQL service on this machine) and Adminer on :8080.
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

- `backend/.env`: `DATABASE_URL` (mysql), optional `PORT`, `JWT_SECRET` (falls back to a dev-only default with a warning), `CORS_ORIGINS` (comma-separated; defaults to :5173 and :3001)
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
