## ADDED Requirements

### Requirement: Brand Creation

The system SHALL allow users to create a Content Brand (Marca de Conteúdo) with a name, niche, language, default tone, default video style, and default content format.

#### Scenario: Create brand successfully

- **WHEN** user provides valid brand configuration (name, niche, language, tone, video style, content format)
- **THEN** system creates the brand and returns the brand record.

### Requirement: Platform Account Association

The system SHALL allow associating a Content Brand with an external platform account (e.g. YouTube).

#### Scenario: Associate brand with YouTube account

- **WHEN** user associates an active Google/YouTube account with the brand
- **THEN** system creates a brand-platform-account relationship representing the external channel connection.
