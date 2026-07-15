## Why

O sistema precisa separar a marca e o conteúdo das configurações específicas de cada destino e formato de distribuição. Sem perfis reutilizáveis, cada projeto teria de repetir configurações de plataforma, vídeo e postagem, dificultando a geração de versões como YouTube Shorts e YouTube Long Form e comprometendo a consistência do MVP.

## What Changes

- Criar perfis de distribuição vinculados a uma marca, usando `platform` e `content_format` como dimensões independentes e plataforma-agnóstica.
- Permitir criar, listar, editar e arquivar perfis, com slug único dentro da marca e suporte inicial a YouTube Shorts e Long Form.
- Configurar resolução, aspect ratio, durações mínima, máxima e alvo, timezone, horários padrão, templates de título e descrição, tags e hashtags.
- Preparar o contrato plataforma-agnóstico para que perfis possam ser selecionados por projetos futuramente.
- Adiar a criação de alvos de distribuição e seus snapshots para o EPIC 07, quando a entidade `content_projects` existir.
- Adicionar endpoints HTTP explícitos em `/src/routes/api/v1/` para operações de perfis, com autorização baseada na marca do usuário.
- Adicionar a tabela e migração Drizzle de `distribution_profiles`; não criar uma tabela de projetos neste change.
- Cobrir regras de negócio, autorização e validações com testes Vitest em fluxo TDD; testes de controlador ficarão no módulo correspondente, não em `src/routes`.

## Capabilities

### New Capabilities

- `distribution-profiles`: Gerenciamento de perfis de distribuição, configurações padrão, estados ativo/arquivado e isolamento por marca.

### Modified Capabilities

Nenhuma.

## Impact

- Banco PostgreSQL e schema Drizzle: nova entidade plataforma-agnóstica `distribution_profiles`, relacionada a marcas.
- Backend modular: novo módulo de distribuição com schemas Zod, serviços, repositórios, políticas, DTOs e controladores.
- API: novos endpoints versionados em `/src/routes/api/v1/` para CRUD e arquivamento de perfis.
- Frontend: telas e formulários para gerenciar perfis.
- EPIC 07: deverá adicionar `content_project_targets`, seleção múltipla e snapshots imutáveis usando o contrato deste change.
- Testes: testes Node para persistência, validações, autorização e controladores; testes Browser apenas para os fluxos de formulário essenciais.
