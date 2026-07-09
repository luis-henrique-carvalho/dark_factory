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

*Alternatives considered:*
- Storing settings in a JSON field: Rejected because defining explicit columns allows for easier validation, queries, and type safety with Drizzle.
- Using a boolean `isArchived` flag: Rejected because using a `status` enum/varchar string is more extensible for future states (e.g., 'suspended', 'template', etc.).

### Decision 2: API Endpoints Scoped to Authenticated User
Endpoints will be defined under `/src/routes/api/v1/brands`:
- `GET /api/v1/brands`: Returns all active brands for the authenticated user (with optional query parameter `?includeArchived=true` or similar, or just a separate status filter).
- `POST /api/v1/brands`: Accepts brand data, validates via Zod schema, associates the authenticated user's ID, inserts into the database, and returns the record.
- `GET /api/v1/brands/:id`: Retrieves a single brand (validating that the user owns it).
- `PUT /api/v1/brands/:id`: Updates brand details (validating owner).
- `PATCH /api/v1/brands/:id/archive`: Performs a soft archiving by setting status to `archived` (validating owner).

*Alternatives considered:*
- Server Functions (TanStack Start): Rejected in favor of explicit HTTP Server Routes under `/api/v1/brands` to facilitate future decoupled backend microservices, as mandated by the project context.

### Decision 3: Modular Frontend Structure under `src/modules/brands/`
We will structure the brand module cleanly:
- `src/modules/brands/schemas/brand.schema.ts`: Zod schemas for input validation (used both on front-end form and back-end route).
- `src/modules/brands/components/BrandForm.tsx`: Component for creation/editing, using `react-hook-form` + `@hookform/resolvers/zod`.
- `src/modules/brands/components/BrandList.tsx`: Dashboard/grid listing active brands with archive action.
- `src/modules/brands/hooks/useBrands.ts`: Queries and mutations using `useQuery` and `useMutation` from TanStack Query.
- `src/modules/brands/views/BrandsDashboardView.tsx`: Main view containing listing and a dialog for new brand creation.

## Risks / Trade-offs

- **Risk**: Deleting or archiving a brand might break existing content projects that reference it.
  - *Mitigation*: We will use a soft archiving status `archived`. The brand remains in the DB, so foreign keys to existing projects/publication plans won't break, but it will be filtered out from dropdowns when creating new projects.
- **Risk**: Concurrent test runs colliding in PostgreSQL.
  - *Mitigation*: Run Vitest backend/DB tests sequentially (`fileParallelism: false`) with database truncation before each test (using TRUNCATE CASCADE via setup files), as specified in the project context.
