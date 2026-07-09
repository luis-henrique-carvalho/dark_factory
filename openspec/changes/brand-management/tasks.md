## 1. Database Setup & Schema Tests (TDD)

- [x] 1.1 Write failing Vitest DB schema tests in `src/db/__tests__/brands.test.ts` to assert that the `brands` table contains the required fields (`id`, `userId`, `name`, `niche`, `language`, `status`, `createdAt`, `updatedAt`).

## 2. Backend API Endpoints & Business Logic (TDD)

- [x] 2.1 Write failing controller integration tests in `src/modules/brands/server/controllers/__tests__/brands.test.ts` for creating, listing, updating, and archiving brands.
- [x] 2.2 Implement the brands repository, service, and controller logic in `src/modules/brands/server/`.
- [x] 2.3 Create HTTP server routes at `/src/routes/api/v1/brands/` matching the CRUD structure, and link them to the controller. Verify all backend integration tests pass.

## 3. Frontend UI Components, Hooks, & Views (TDD)

- [x] 3.1 Write failing frontend browser tests in `src/modules/brands/components/__tests__/BrandForm.test.ts` and `BrandList.test.tsx` to assert correct layout, validations, and click handlers.
- [x] 3.2 Implement Zod schema validation for brand operations in `src/modules/brands/schemas/brand.schema.ts`.
- [x] 3.3 Create TanStack Query queries and mutations in `src/modules/brands/hooks/useBrands.ts` for fetching, creating, updating, and archiving brands.
- [x] 3.4 Implement the `BrandForm` and `BrandList` components using shadcn/ui and Tailwind CSS.
- [x] 3.5 Build the `BrandListView` component, integrate it into a dashboard route (e.g., `/dashboard/brands` or `/brands`), and register the route in TanStack Router. Verify all frontend browser tests pass.
