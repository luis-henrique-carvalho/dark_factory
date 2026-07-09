## Context

Currently, the documentation defines "canal interno" (internal channel) as the core boundary for content vertical configuration. This includes database table schemas named `creator_channels` and relation tables named `channel_platform_accounts`.
To ensure the platform is agnostic and supports multiple distribution networks (YouTube, TikTok, Instagram) without naming mismatch, we are renaming these terms.

## Goals / Non-Goals

**Goals:**

- Update all occurrences of "canal interno" and "canais internos" to "marca" and "marcas" in [PRD.md](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/docs/PRD.md), [EPICS.md](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/docs/EPICS.md), and [ARQUITECTURE.md](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/docs/ARQUITECTURE.md).
- Rename table schemas from `creator_channels` to `brands` and `channel_platform_accounts` to `brand_platform_accounts` in the documentation.
- Rename foreign keys from `creator_channel_id` to `brand_id` in all documented schema definitions (e.g. `distribution_profiles`, `content_projects`, `brand_platform_accounts`).

**Non-Goals:**

- Code migration: Since the codebase does not yet implement these tables (only the `users` table exists in `src/db/schema`), we do not need to rewrite database models or run SQL migrations. We only update the specifications and documentation.
- Altering business logic: The relationship constraints and features (generating ideas, script editing, etc.) remain identical; only their terminologies change.

## Decisions

### 1. Renaming `creator_channels` to `brands`

- **Alternatives Considered:** `content_brands`, `workspaces`, `accounts`.
- **Decision:** Use `brands` for database tables/attributes, and "Marca" (or "Marcas") for the user-facing Portuguese interface.
- **Rationale:** `brands` is concise, clear, and perfectly maps to the domain (creators managing multiple dark video brands). `workspaces` is too generic and doesn't represent editorial content branding. `accounts` would clash with the external social platform credentials (`platform_accounts`).

### 2. Renaming `channel_platform_accounts` to `brand_platform_accounts`

- **Decision:** Align the mapping table to match the new `brands` table name.
- **Rationale:** Maintains consistency in mapping brands to external platform accounts.

## Risks / Trade-offs

- **Risk:** Developers or stakeholders accustomed to "canal" might get confused initially.
- **Mitigation:** Document the mapping clearly in the PRD and architecture guides, and enforce the "Marca" terminology across both UI copy and backend schemas from day one.
