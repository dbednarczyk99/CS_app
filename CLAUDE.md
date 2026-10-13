# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Chleba Smak: the website and admin panel for a bakery. A monorepo with two independent npm packages (each has its own `package.json` and lockfiles; there is no root package):

- `backend/`: NestJS 11 REST API, Prisma 6 ORM, MySQL
- `frontend/`: React 19 and Vite admin panel built on **react-admin** 5

Code comments and some UI strings are in Polish.

Project goals, scope, planned architecture (public Next.js storefront in `web/`, customer accounts, per-store stock, orders and payments) and roadmap are in [docs/ZALOZENIA.md](docs/ZALOZENIA.md) (in Polish). Read it before planning new features.

## Commands

Local infrastructure (MySQL 8 on :3306 with db `chleba_smak_dev`, user `dev`/`dev`; Adminer on :8080):
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

## Environment

- `backend/.env`: `DATABASE_URL` (mysql), optional `PORT`, `JWT_SECRET` (falls back to a hardcoded default)
- `frontend/.env`: `VITE_API_URL` (defaults to `http://localhost:3000`)
- CORS in [backend/src/main.ts](backend/src/main.ts) is hardcoded to `http://localhost:5173`

## Backend architecture

- Feature modules live in `backend/src/modules/<feature>/` (products and categories, blog and tags, bread-van, contact/contact-info, contact/locations, auth). Each module has a controller, a service and `dto/`. Nested features (e.g. `blog/tags`, `contact/*`) are separate Nest modules, and each one is registered directly in [app.module.ts](backend/src/app.module.ts).
- There is no shared PrismaModule. Each feature module lists `PrismaService` in its own `providers`, so a new module must do the same.
- **There are no auth guards on any route.** `AuthModule` only issues JWTs (`POST /auth/login` returns `access_token`, 1h expiry; passwords use bcrypt). There is no global `ValidationPipe` either, so class-validator decorators on DTOs are not enforced.
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
