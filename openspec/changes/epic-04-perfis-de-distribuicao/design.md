## Context

O módulo `brands` estabelece o padrão atual do projeto: cada domínio possui `components`, `contracts`, `hooks`, `schemas`, `services`, `views` e uma camada `server` com `controllers`, `dtos`, `errors`, `policies`, `repositories` e `services`. As rotas HTTP usam TanStack Router em `src/routes/api/v1/`, com `authMiddleware` e `requestLoggerMiddleware`; o acesso ao PostgreSQL é feito por Drizzle em `src/db/schema/`.

O EPIC 04 introduz configurações reutilizáveis de distribuição. O desenho precisa preservar o isolamento por usuário/marca e permitir múltiplas plataformas no futuro. A relação com projetos será implementada no EPIC 07, pois a entidade `content_projects` ainda não existe no código.

## Goals / Non-Goals

**Goals:**

- Criar um módulo de domínio para perfis de distribuição seguindo a estrutura de `brands`.
- Modelar plataforma e formato como campos independentes, sem acoplar o domínio a YouTube.
- Expor CRUD e arquivamento de perfis por API HTTP versionada.
- Deixar um contrato estável para que o EPIC 07 selecione múltiplos perfis e persista snapshots imutáveis por alvo.
- Centralizar validação em schemas Zod e autorização em policies do módulo.
- Implementar as regras críticas com testes Node e os fluxos de formulário essenciais com testes Browser, seguindo TDD.

**Non-Goals:**

- Criar integração OAuth ou contas de plataformas.
- Implementar projetos de conteúdo completos, renderização ou publicação.
- Executar agendamento; o perfil fornece defaults e o plano de publicação definirá o horário efetivo.
- Criar `content_project_targets` e snapshots; isso fica fora deste change.

## Decisions

### 1. Novo módulo com a mesma separação de `brands`

Será criado `src/modules/distribution-profiles/` com:

```text
components/
contracts/
hooks/
schemas/
server/
  controllers/
  dtos/
  errors/
  policies/
  repositories/
  services/
services/
views/
```

**Alternativa considerada:** colocar a lógica dentro de `brands`. Foi rejeitada porque perfis são um domínio reutilizado por projetos, renderização e publicação, e não apenas uma propriedade de apresentação da marca.

### 2. Modelo relacional plataforma-agnóstico

Adicionar o schema Drizzle para o conceito `distributionProfile`, mantendo `brandId`, `platform` e `contentFormat` como campos explícitos. O perfil terá configurações técnicas e defaults de postagem. Não será criada FK para projeto neste change.

O slug será único por marca. Perfis arquivados continuarão persistidos; a regra que impede sua seleção em novos projetos será implementada junto com os targets no EPIC 07.

**Alternativa considerada:** criar uma tabela mínima de projetos apenas para suportar os targets. Foi rejeitada porque anteciparia o EPIC 07 e criaria uma segunda definição de projeto.

### 3. API e autorização

As rotas serão aninhadas sob a marca em `src/routes/api/v1/brands/$brandId/distribution-profiles/`, mantendo o padrão existente:

- `GET /api/v1/brands/:brandId/distribution-profiles`: lista perfis da marca, com filtros/paginação necessários.
- `POST /api/v1/brands/:brandId/distribution-profiles`: cria perfil.
- `PUT /api/v1/brands/:brandId/distribution-profiles/:distributionProfileId`: edita perfil.
- `POST /api/v1/brands/:brandId/distribution-profiles/:distributionProfileId/archive`: arquiva perfil.
- Endpoints de targets serão definidos junto ao módulo de projetos no EPIC 07.

Todos os handlers usarão `authMiddleware`, DTOs Zod, controller, service, repository e policy. O repository sempre filtrará por `userId`/`brandId`, evitando confiar apenas no identificador recebido pela API.

**Alternativa considerada:** Server Functions. Foi rejeitada porque o projeto define rotas HTTP explícitas para manter o backend desacoplável.

### 4. TDD e testes por camada

O ciclo será Red-Green-Refactor, priorizando as regras que protegem dados e comportamento:

1. testes Node para schemas, unicidade/estado no repository, isolamento na policy e regras do service;
2. testes Node de controllers para status HTTP, payload inválido e acesso proibido;
3. testes Browser para formulário, filtros e lista de perfis.

Os testes de controller ficarão em `src/modules/distribution-profiles/server/controllers/__tests__/`, como no módulo `brands`; nenhum teste será colocado em `src/routes`.

### 5. Migração incremental

A migração Drizzle será gerada depois dos schemas, aplicada ao banco de teste antes dos testes de integração e incluída no fluxo normal de `db:generate`/`db:migrate`. Como as novas tabelas não substituem dados existentes, o rollback inicial consiste em reverter a migração e remover o módulo sem alterar a tabela `brand`.

## Risks / Trade-offs

- **[Projeto ainda não possui o módulo de content projects]** → deixar targets e snapshots explicitamente para o EPIC 07.
- **[Configurações de postagem podem evoluir]** → manter os campos do perfil tipados e documentar a versão do snapshot quando o EPIC 07 for implementado.
- **[Nomes de plataforma/formato livres podem gerar inconsistência]** → usar enums/unions de domínio para valores suportados, mantendo extensibilidade para novos adapters.
