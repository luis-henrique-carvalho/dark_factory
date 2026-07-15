## 1. Banco de dados e schemas

- [x] 1.1 Criar o schema Drizzle `distribution_profile`, com relação para marca, status, plataforma, formato, configurações técnicas e defaults de postagem.
- [x] 1.2 Adicionar índice por `brand_id` e unicidade por `(brand_id, slug)`, com deleção referencial compatível com a marca.
- [x] 1.3 Exportar o schema em `src/db/schema/index.ts` e gerar a migração Drizzle correspondente.
- [x] 1.4 Escrever testes Node de persistência para ownership, slug duplicado, perfis arquivados e preservação dos campos de configuração.
- [x] 1.5 Executar a migração no banco de teste e confirmar que os testes existentes do módulo `brands` continuam passando.

## 2. Backend, endpoints e testes

- [x] 2.1 Criar a estrutura `src/modules/distribution-profiles/` seguindo o padrão de `brands`, incluindo contracts, schemas, DTOs, errors, policies, repositories, services e controllers.
- [x] 2.2 Escrever primeiro os testes Node que falham para validação de perfil, ownership, slug único, ordem das durações e timezone obrigatório quando houver agenda.
- [x] 2.3 Implementar schemas Zod e DTOs para criação, listagem, edição e arquivamento, mantendo `platform` e `contentFormat` independentes.
- [x] 2.4 Implementar policy, repository e service com filtragem obrigatória por usuário/marca e distinção entre perfis ativos e arquivados.
- [x] 2.5 Implementar controllers para listar/criar/editar/arquivar perfis e rotas TanStack aninhadas em `src/routes/api/v1/brands/$brandId/distribution-profiles/`, usando `authMiddleware` e `requestLoggerMiddleware`.
- [x] 2.6 Escrever testes de controller em `src/modules/distribution-profiles/server/controllers/__tests__/` para autenticação, autorização, payload inválido, conflito e respostas de sucesso.
- [x] 2.7 Executar testes Node e corrigir erros de tipos, lint e contratos sem colocar testes dentro de `src/routes`.

## 3. Frontend/UI e testes

- [x] 3.1 Criar contracts, query keys, invalidations, API client e hook `useDistributionProfiles` seguindo o padrão de `useBrands` e dos serviços existentes.
- [x] 3.2 Criar schemas de formulário e componentes para listar, filtrar, criar, editar e arquivar perfis, mantendo a separação `components`, `views` e `services`.
- [x] 3.3 Escrever testes Browser que falham para renderização da lista, validação dos campos, edição/arquivamento e apresentação de platform/content format.
- [x] 3.4 Implementar a view de gestão de perfis com formulário para resolução, aspect ratio, durações, timezone, horários, templates, tags e hashtags.
- [x] 3.5 Documentar no contrato do módulo que seleção múltipla e snapshots serão integrados pelo EPIC 07 quando `content_projects` existir.

## 4. Integração futura e validação

- [x] 4.1 Registrar no contrato de distribuição os campos que o futuro snapshot deverá preservar: platform, contentFormat, configurações técnicas, templates, tags, hashtags e defaults de postagem.
- [x] 4.2 Executar a suíte Node, testes Browser, validação de tipos, lint e geração de rotas antes de considerar o módulo pronto.
