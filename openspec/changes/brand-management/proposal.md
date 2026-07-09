## Why

Currently, there is no centralized entity to represent a content brand (editorial line) in the system, preventing users from organizing their ideas, scripts, and media generation. This P0 change introduces brand management (Gestão de marcas) as a platform-agnostic entity, which serves as the foundation for the Content Factory's organization and distribution.

## What Changes

- **Database Table**: Create a new table `brands` to store content brand profiles (name, niche, language, and status).
- **Backend API**: Implement CRUD routes for brands under `/api/v1/brands`.
- **Domain Module**: Create the `src/modules/brands/` directory with components, hooks, schemas, and server-side logic (controllers, services, repositories).
- **Frontend Pages/Components**: Add UI views for listing brands, creating a brand, editing a brand, and archiving a brand.
- **Filtering Rules**: Ensure archived brands are excluded from default selection prompts and new project creations.

## Capabilities

### New Capabilities

*(none)*

### Modified Capabilities

- `brand-management`: Expand this capability to include listing, editing, and archiving brands, establishing the basic brand settings (niche, language), and ensuring archived brands are excluded from default options.

## Impact

- **Database Schema**: A new schema file at [brands.ts](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/src/db/schema/brands.ts) defining the `brands` table.
- **API Routes**:
  - `POST /api/v1/brands` to create a brand.
  - `GET /api/v1/brands` to list active and optionally archived brands.
  - `PUT /api/v1/brands/:id` to edit brand details.
  - `PATCH /api/v1/brands/:id/archive` to archive a brand.
- **Frontend Routes**: A new dashboard view for managing brands under `/brands` or `/dashboard/brands`.
- **TDD / Testing Plan**:
  - Backend tests run in Node mode with PostgreSQL, targeting the repository, service, and controllers. (e.g. `src/modules/brands/server/controllers/brands.test.ts`).
  - Frontend tests run in Vitest Browser Mode using Playwright to verify components and form validation behavior.
  - All test blocks (`it`) must start with "should".
