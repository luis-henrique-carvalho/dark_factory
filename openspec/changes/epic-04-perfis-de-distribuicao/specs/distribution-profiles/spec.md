## ADDED Requirements

### Requirement: Profile ownership and platform-agnostic identity

The system SHALL associate each distribution profile with exactly one brand and SHALL represent the destination using independent `platform` and `content_format` values. A profile slug SHALL be unique within its brand, while multiple profiles may share the same platform and format when their slugs differ.

#### Scenario: Create a profile for a brand

- **WHEN** an authenticated user submits a valid slug, platform, content format, and brand identifier
- **THEN** the system creates an active profile owned by that brand and returns it with its identifier

#### Scenario: Reject a duplicate slug within a brand

- **WHEN** an authenticated user submits a profile slug already used by another profile of the same brand
- **THEN** the system rejects the request with a conflict validation error and does not create a profile

#### Scenario: Allow the same slug in different brands

- **WHEN** an authenticated user creates profiles with the same slug under two brands they own
- **THEN** the system accepts both profiles because uniqueness is scoped to the brand

### Requirement: Profile configuration validation

The system SHALL validate resolution, aspect ratio, duration limits, timezone, posting days and posting times, title and description templates, tags, and hashtags before persisting a profile. The minimum duration SHALL NOT exceed the target duration, and the target duration SHALL NOT exceed the maximum duration.

#### Scenario: Save a valid Shorts configuration

- **WHEN** a profile contains valid technical settings, explicit timezone, posting defaults, and duration values in ascending order
- **THEN** the system persists the complete configuration without changing the independent platform and content format values

#### Scenario: Reject inconsistent duration values

- **WHEN** the minimum, target, or maximum duration violates the required ordering
- **THEN** the system rejects the profile with a field-level validation error

#### Scenario: Reject an incomplete posting schedule

- **WHEN** posting times or posting days are provided without an explicit valid timezone
- **THEN** the system rejects the profile and does not persist partial schedule defaults

### Requirement: Profile lifecycle and listing

The system SHALL provide authenticated operations to create, list, edit, and archive profiles. Archived profiles SHALL remain readable for existing references but SHALL NOT be returned as selectable active profiles for new projects.

#### Scenario: List profiles owned by the user

- **WHEN** an authenticated user requests the profile list for a brand they own
- **THEN** the system returns only profiles belonging to that brand and applies the requested active/archived filter

#### Scenario: Archive a profile

- **WHEN** an authenticated user archives an active profile they own
- **THEN** the system marks the profile as archived and returns the updated profile

#### Scenario: Edit an owned profile

- **WHEN** an authenticated user submits valid changes for an active or archived profile they own
- **THEN** the system updates the profile while preserving its brand ownership and identifier

#### Scenario: Prevent selection of an archived profile

- **WHEN** a new project target references an archived profile
- **THEN** the system rejects target creation and leaves the project unchanged

### Requirement: Profile API authorization

The system SHALL expose profile operations through authenticated HTTP routes under `/api/v1/brands/:brandId/distribution-profiles/` and SHALL deny access when the authenticated user does not own the referenced brand or profile.

#### Scenario: Reject an unauthenticated profile request

- **WHEN** a client calls a profile endpoint without a valid authenticated session
- **THEN** the system returns an authentication error before invoking the profile service

#### Scenario: Reject access to another user's brand

- **WHEN** an authenticated user submits a profile operation for a brand owned by another user
- **THEN** the system returns `403` or an equivalent forbidden response and does not expose profile data

#### Scenario: Return a not-found result for an unavailable profile

- **WHEN** an authenticated user requests a profile identifier outside their accessible scope
- **THEN** the system returns the module's not-found response without modifying any record
