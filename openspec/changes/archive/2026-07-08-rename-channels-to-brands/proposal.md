## Why

The term "Internal Channel" (`creator_channels`) is YouTube-centric and creates conceptual coupling in the system's design. To support publishing to multiple platforms (YouTube, TikTok, Instagram, etc.), we need a platform-agnostic term to represent a content vertical/brand. We will rename "Internal Channel" to "Brand" (Marca) across all documentation, system specifications, and schemas.

## What Changes

- **BREAKING**: Rename database table `creator_channels` to `brands`.
- **BREAKING**: Rename database table `channel_platform_accounts` to `brand_platform_accounts`.
- **BREAKING**: Rename column `creator_channel_id` to `brand_id` in all dependent tables (such as `distribution_profiles`, `brand_platform_accounts`, `content_projects`, etc.).
- Update all documentation files ([PRD.md](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/docs/PRD.md), [EPICS.md](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/docs/EPICS.md), and [ARQUITECTURE.md](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/docs/ARQUITECTURE.md)) to replace "canal interno" with "marca" and update technical schemas.

## Capabilities

### New Capabilities

- `brand-management`: Manage content brands (formerly creator channels), their settings (niche, language, tone, format), and their associations with external platform accounts.

### Modified Capabilities

<!-- None -->

## Impact

- Database schema definitions (Drizzle ORM configuration and migrations in the future).
- Domain models and code references in subsequent pull requests.
- Main project documentation: [PRD.md](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/docs/PRD.md), [EPICS.md](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/docs/EPICS.md), and [ARQUITECTURE.md](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/docs/ARQUITECTURE.md).
