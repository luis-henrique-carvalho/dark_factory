## ADDED Requirements

### Requirement: Brand Listing

The system SHALL allow users to list all active and archived Content Brands that belong to their user account.

#### Scenario: List active brands successfully

- **WHEN** the authenticated user requests their list of brands
- **THEN** the system SHALL return only the active brands associated with that user.

#### Scenario: List archived brands successfully

- **WHEN** the authenticated user requests their archived brands
- **THEN** the system SHALL return only the archived brands associated with that user.

### Requirement: Brand Editing

The system SHALL allow users to edit the properties of a Content Brand (name, niche, language).

#### Scenario: Edit brand successfully

- **WHEN** user provides valid updated configuration (name, niche, language) for an existing brand they own
- **THEN** the system SHALL update the brand and return the updated brand record.

### Requirement: Brand Archiving

The system SHALL allow users to archive an existing Content Brand they own, which changes its status to archived.

#### Scenario: Archive brand successfully

- **WHEN** user requests to archive a brand they own
- **THEN** the system SHALL change the brand's status to archived.

### Requirement: Archived Brand Exclusion

The system SHALL exclude archived Content Brands from being displayed as options or pre-selected during new project creation.

#### Scenario: Exclude archived brand from options

- **WHEN** a user views available brands for creating a new project
- **THEN** the system SHALL only display active brands and exclude archived ones.

## MODIFIED Requirements

### Requirement: Brand Creation

The system SHALL allow users to create a Content Brand (Marca de Conteúdo) with a name, niche, and language.

#### Scenario: Create brand successfully

- **WHEN** user provides valid brand configuration (name, niche, language)
- **THEN** system creates the brand and returns the brand record.
