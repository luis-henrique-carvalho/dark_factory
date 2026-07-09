## Context

We are implementing the brand management (Gestão de marcas) feature in Creator Factory AI. Currently, there is a `users` table, but no `brands` table or module exists. We need a clean structure for content brands that holds basic configurations (niche, language) in a platform-agnostic manner.

## Goals / Non-Goals

**Goals:**

- Implement the `brands` database schema using Drizzle ORM.
- Build backend HTTP API CRUD endpoints under `/src/routes/api/v1/brands`.
- Design client-side module `src/modules/brands` with forms, views, components, and state management (TanStack Query/Mutations).
- Support soft archiving of brands so they can be hidden from new project selections without breaking past references.
- Achieve 100% test coverage using TDD (Vitest Node mode for backend/db, Vitest Browser mode for frontend UI).

**Non-Goals:**

- Platform account authentication/association (YouTube/OAuth setup) is out of scope for this change (belongs to EPIC 05 / EPIC 06).
- Creating actual projects, ideas, or scripts (belongs to subsequent epics).

## Decisions

### Decision 1: Database Table Structure (`src/db/schema/brands.ts`)

We will create a table named `brands` with:

- `id`: `uuid` (primary key, default random)
- `userId`: `uuid` (foreign key to `users.id`, non-nullable)
- `name`: `varchar(255)` (non-nullable)
- `niche`: `varchar(255)` (non-nullable)
- `language`: `varchar(100)` (non-nullable, e.g., "pt-BR", "en-US")
- `status`: `varchar(50)` (non-nullable, defaults to 'active', values: 'active' | 'archived')
- `createdAt`: `timestamp` (default now)
- `updatedAt`: `timestamp` (default now)

_Alternatives considered:_

- Storing settings in a JSON field: Rejected because defining explicit columns allows for easier validation, queries, and type safety with Drizzle.
- Using a boolean `isArchived` flag: Rejected because using a `status` enum/varchar string is more extensible for future states (e.g., 'suspended', 'template', etc.).

### Decision 2: API Endpoints Scoped to Authenticated User

Endpoints will be defined under `/src/routes/api/v1/brands`:

- `GET /api/v1/brands`: Returns all active brands for the authenticated user (with optional query parameter `?includeArchived=true` or similar, or just a separate status filter).
- `POST /api/v1/brands`: Accepts brand data, validates via Zod schema, associates the authenticated user's ID, inserts into the database, and returns the record.
- `GET /api/v1/brands/:id`: Retrieves a single brand (validating that the user owns it).
- `PUT /api/v1/brands/:id`: Updates brand details (validating owner).
- `PATCH /api/v1/brands/:id/archive`: Performs a soft archiving by setting status to `archived` (validating owner).

_Alternatives considered:_

- Server Functions (TanStack Start): Rejected in favor of explicit HTTP Server Routes under `/api/v1/brands` to facilitate future decoupled backend microservices, as mandated by the project context.

### Decision 3: Modular Frontend Structure under `src/modules/brands/`

We will structure the brand module cleanly:

- `src/modules/brands/schemas/brand.schema.ts`: Zod schemas for input validation (used both on front-end form and back-end route).
- `src/modules/brands/components/BrandForm.tsx`: Component for creation/editing, using `react-hook-form` + `@hookform/resolvers/zod`.
- `src/modules/brands/components/BrandList.tsx`: Dashboard layout showing active brands in a responsive **grid of cards** rather than a database table, matching the UI/UX pattern from [shadcn-admin/src/features/apps/index.tsx](file:///home/luis/Documentos/Git/DarkVideos/shadcn-admin/src/features/apps/index.tsx). Each brand card will display its name, niche, language, and custom action options (e.g. edit, archive).
- `src/modules/brands/hooks/useBrands.ts`: Queries and mutations using `useQuery` and `useMutation` from TanStack Query.
- `src/modules/brands/views/BrandListView.tsx`: Main view containing listing and a dialog for new brand creation.

### Decision 4: Reference Implementation Pattern (`src/modules/users`)

To ensure consistency across domain modules, the development of the `brands` module will be modeled directly after the `users` module ([src/modules/users](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/src/modules/users)):

- **Backend Architecture**: Adopt functional controllers (exposing handler objects for request/response operations), static auth policies (`BrandsPolicy`), and custom domain errors with a dedicated error handler.
- **Frontend Architecture**: Utilize a centralized React Context Provider (`BrandsProvider`) to manage open states for action dialogs (add, edit, delete) and tracking the `currentRow` state.
- **TanStack & Form Integrations**: Separate Query/Mutation hooks from API wrapper files, and construct form schemas leveraging unified Zod validation schemas.
- **Testing Approach**: Write backend integration tests for controllers targeting the actual request/response layer, mimicking the structure of `users-api.integration.test.ts`.

## Risks / Trade-offs

- **Risk**: Deleting or archiving a brand might break existing content projects that reference it.
  - _Mitigation_: We will use a soft archiving status `archived`. The brand remains in the DB, so foreign keys to existing projects/publication plans won't break, but it will be filtered out from dropdowns when creating new projects.
- **Risk**: Concurrent test runs colliding in PostgreSQL.
  - _Mitigation_: Run Vitest backend/DB tests sequentially (`fileParallelism: false`) with database truncation before each test (using TRUNCATE CASCADE via setup files), as specified in the project context.
