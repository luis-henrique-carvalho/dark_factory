# Arquitetura e Stack — Creator Factory AI

> Plataforma pessoal para criação, renderização e agendamento de conteúdos de canais dark/faceless, começando por YouTube, mas preparada para outras plataformas no futuro.

---

## 1. Decisão arquitetural principal

O projeto será construído como um **monolito modular**.

Isso significa:

- uma única aplicação no início;
- módulos bem separados por domínio;
- API HTTP versionada via **Server Routes**;
- backend interno organizado em controllers, services, policies e repositories;
- frontend desacoplado da implementação interna do backend;
- possibilidade real de extrair o backend no futuro sem reescrever toda a UI.

A regra principal da arquitetura é:

> O domínio do produto é conteúdo. Plataformas como YouTube, TikTok e Instagram são apenas destinos de distribuição.

Portanto, o sistema deve evitar modelagem presa ao YouTube no core.

Evitar:

```txt
youtube_videos
youtube_uploads
youtube_schedules
youtube_channels
```

Preferir:

```txt
platform_accounts
platform_publications
publication_plans
brands
distribution_profiles
rendered_videos
```

---

## 2. Stack definida

### 2.1 Aplicação

| Camada               | Tecnologia                     | Responsabilidade                                 |
| -------------------- | ------------------------------ | ------------------------------------------------ |
| Framework full-stack | TanStack Start                 | App web, rotas, SSR, Server Routes               |
| Roteamento           | TanStack Router                | Rotas tipadas, layouts, search params            |
| Server State         | TanStack Query                 | Queries, mutations, cache, invalidations         |
| UI                   | shadcn/ui                      | Componentes visuais                              |
| Referência UI/UX     | shadcn-admin                   | Layout administrativo, sidebar, páginas internas |
| Formulários          | React Hook Form                | Controle de formulários                          |
| Validação            | Zod                            | Schemas, validação runtime, contratos            |
| Banco                | PostgreSQL                     | Persistência principal                           |
| ORM                  | Drizzle ORM                    | Schema tipado, queries, migrations               |
| Jobs/workflows       | Inngest                        | Pipeline assíncrona de geração/render/publicação |
| Renderização         | FFmpeg                         | Composição e exportação de vídeos                |
| Storage              | Cloudflare R2 ou S3-compatible | Áudios, imagens, thumbnails, legendas e vídeos   |
| Integração inicial   | YouTube Data API               | Upload, metadados e agendamento                  |
| Futuras integrações  | Platform adapters              | TikTok, Instagram, Kwai, Facebook etc.           |

---

## 3. Decisão sobre Server Routes

A aplicação usará **Server Routes como API principal**, em vez de Server Functions.

Motivo:

- permite construir uma API HTTP explícita desde o começo;
- facilita desacoplar o backend no futuro;
- deixa o frontend dependente de contratos HTTP, não de chamadas internas do framework;
- facilita testes de API;
- facilita futura migração para NestJS, Fastify, Hono, Express, Java/Spring, Go etc.

Fluxo principal:

```txt
View
  ↓
Hooks
  ↓
Client Services
  ↓
HTTP API / Server Routes
  ↓
Controllers
  ↓
Application Services / Use Cases
  ↓
Policies / Domain Rules
  ↓
Repositories
  ↓
Drizzle / PostgreSQL
```

---

## 4. Monolito modular

### 4.1 Por que monolito modular

O projeto ainda é pessoal/MVP. Um microserviço agora traria complexidade desnecessária.

O monolito modular entrega:

- velocidade de desenvolvimento;
- baixo overhead operacional;
- deploy mais simples;
- separação lógica forte;
- possibilidade de extração futura;
- menos duplicação de código;
- melhor DX para MVP.

A fronteira entre módulos deve ser respeitada desde o começo.

Um módulo pode depender de `shared`, `db`, `integrations` e contratos públicos de outros módulos, mas deve evitar acessar internamente arquivos privados de outro módulo.

---

## 5. Estrutura global sugerida

```txt
src/
  app/
    providers/
      query-client-provider.tsx
      theme-provider.tsx
      auth-provider.tsx

  routes/
    __root.tsx

    _authenticated/
      index.tsx

      creator-channels/
        index.tsx
        create.tsx
        $channelId.tsx

      content-projects/
        index.tsx
        create.tsx
        $contentProjectId.tsx

      publications/
        index.tsx
        $publicationId.tsx

      platform-accounts/
        index.tsx

      content-factory/
        index.tsx

    api/
      v1/
        creator-channels/
          index.ts
          $channelId.ts

        content-projects/
          index.ts
          $contentProjectId.ts
          $contentProjectId.generate-ideas.ts
          $contentProjectId.generate-script.ts
          $contentProjectId.approve-script.ts
          $contentProjectId.render.ts

        publications/
          index.ts
          $publicationId.ts
          $publicationId.approve.ts
          $publicationId.upload.ts
          $publicationId.schedule.ts

        platform-accounts/
          index.ts
          youtube.connect.ts
          youtube.callback.ts
          $platformAccountId.ts

      inngest.ts

  modules/
    creator-channels/
      components/
      views/
      hooks/
      schemas/
      services/
      data/
      server/

    content-projects/
      components/
      views/
      hooks/
      schemas/
      services/
      data/
      server/

    publications/
      components/
      views/
      hooks/
      schemas/
      services/
      data/
      server/

    platform-accounts/
      components/
      views/
      hooks/
      schemas/
      services/
      data/
      server/

    content-factory/
      components/
      views/
      hooks/
      schemas/
      services/
      data/
      server/

    distribution-profiles/
    scripts/
    reference-videos/
    media-assets/
    content-project-targets/
    video-rendering/
    content-generation/
    platform-integrations/

  db/
    schema/
      users.ts
      creator-channels.ts
      distribution-profiles.ts
      platform-accounts.ts
      content-projects.ts
      content-project-targets.ts
      scripts.ts
      media-assets.ts
      rendered-videos.ts
      publications.ts
      audit-logs.ts
    migrations/
    index.ts

  inngest/
    client.ts
    functions/
      generate-ideas.ts
      generate-script.ts
      generate-voiceover.ts
      generate-visual-assets.ts
      render-video.ts
      upload-youtube.ts
      schedule-youtube.ts

  components/
    ui/
    layout/
    data-table/
    status-badge/
    page-header/
    empty-state/

  hooks/
    use-dialog-state.ts
    use-table-url-state.ts

  shared/
    lib/
      api-client.ts
      api-error.ts
      date.ts
      env.ts
      logger.ts
    schemas/
    types/
    constants/
    utils/
```

---

## 6. Estrutura padrão de UI por módulo

A estrutura de telas seguirá o padrão visual do `shadcn-admin`, mas **sem criar uma pasta `features/*` na arquitetura-alvo**.

Cada domínio continua dentro de `src/modules/<module-name>/`. A UI administrativa do domínio fica no próprio módulo, separada das camadas de hooks, schemas, services e server.

Exemplo de módulo com tela administrativa:

```txt
modules/
  <module-name>/
    views/
      index.tsx

    components/
      <module-name>-provider.tsx
      <module-name>-primary-buttons.tsx
      <module-name>-table.tsx
      <module-name>-columns.tsx
      <module-name>-dialogs.tsx
      <module-name>-action-dialog.tsx
      <module-name>-delete-dialog.tsx
      <module-name>-multi-delete-dialog.tsx
      data-table-row-actions.tsx
      data-table-bulk-actions.tsx

    hooks/
      use-<module-name>.ts
      use-<module-name>-form.ts
      use-<module-name>-mutations.ts

    schemas/
      <module-name>-form.schema.ts
      <module-name>.schema.ts

    services/
      <module-name>-api.ts
      <module-name>-query-keys.ts
      <module-name>-invalidations.ts

    contracts/
      <module-name>-list.contract.ts

    data/
      data.ts
      schema.ts
      <module-name>.ts

    server/
      controllers/
        <module-name>.controller.ts
      services/
        <module-name>.service.ts
      repositories/
        <module-name>.repository.ts
        <module-name>.repository.test.ts
      policies/
        <module-name>.policy.ts
      errors/
        <module-name>.errors.ts
        <module-name>.error-handler.ts
      dtos/
        <module-name>.dto.ts
      index.ts
```

Referências atuais no `shadcn-admin`, usadas como inspiração de layout e provider:

```txt
features/tasks/
  index.tsx
  components/
    tasks-provider.tsx
    tasks-primary-buttons.tsx
    tasks-table.tsx
    tasks-columns.tsx
    tasks-dialogs.tsx
    tasks-mutate-drawer.tsx
    tasks-import-dialog.tsx
    tasks-multi-delete-dialog.tsx
    data-table-row-actions.tsx
    data-table-bulk-actions.tsx
  data/
    data.tsx
    schema.ts
    tasks.ts

features/users/
  index.tsx
  components/
    users-provider.tsx
    users-primary-buttons.tsx
    users-table.tsx
    users-columns.tsx
    users-dialogs.tsx
    users-action-dialog.tsx
    users-invite-dialog.tsx
    users-delete-dialog.tsx
    users-multi-delete-dialog.tsx
    data-table-row-actions.tsx
    data-table-bulk-actions.tsx
  data/
    data.ts
    schema.ts
    users.ts
```

Na aplicação final, essa referência deve ser traduzida para módulos:

```txt
modules/tasks/views/index.tsx
modules/tasks/components/tasks-provider.tsx
modules/tasks/components/tasks-primary-buttons.tsx
modules/tasks/components/tasks-table.tsx
modules/tasks/components/tasks-dialogs.tsx

modules/users/views/index.tsx
modules/users/components/users-provider.tsx
modules/users/components/users-primary-buttons.tsx
modules/users/components/users-table.tsx
modules/users/components/users-dialogs.tsx
```

### 6.1 `views/index.tsx` do módulo

O `views/index.tsx` é a composição principal da tela do módulo. Ele deve montar o layout administrativo, envolver a tela com o provider do módulo quando necessário e renderizar tabela/lista/cards, diálogos e ações primárias.

Padrão para páginas internas:

```tsx
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ModuleDialogs } from '../components/module-dialogs'
import { ModulePrimaryButtons } from '../components/module-primary-buttons'
import { ModuleProvider } from '../components/module-provider'
import { ModuleTable } from '../components/module-table'

export function ModuleView() {
  return (
    <ModuleProvider>
      <Header fixed>
        <Search className="me-auto" />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Título</h2>
            <p className="text-muted-foreground">Descrição curta da tela.</p>
          </div>
          <ModulePrimaryButtons />
        </div>

        <ModuleTable data={data} />
      </Main>

      <ModuleDialogs />
    </ModuleProvider>
  )
}
```

Regras:

- usar `Header`, `Main`, `Search`, `ThemeSwitch`, `ConfigDrawer` e `ProfileDropdown` como padrão das telas administrativas;
- usar `Main className='flex flex-1 flex-col gap-4 sm:gap-6'` para telas com tabela ou fluxo principal;
- manter ações principais em `<ModuleName>PrimaryButtons`;
- manter modais, drawers e alert dialogs em `<ModuleName>Dialogs`;
- não colocar regra de negócio crítica dentro de `views/index.tsx`;
- `views/index.tsx` deve ser uma camada de composição, não de domínio;
- se a rota precisar de search params, a view pode usar `getRouteApi`, `route.useSearch()` e `route.useNavigate()` e repassar esses dados para a tabela.

### 6.2 Provider do módulo

O provider do módulo serve para gerenciar estado de UI compartilhado entre tabela, ações de linha, botões e diálogos.

Padrão inspirado em `users-provider.tsx`:

```tsx
import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type ModuleEntity } from '../data/schema'

type ModuleDialogType = 'add' | 'edit' | 'delete'

type ModuleContextType = {
  open: ModuleDialogType | null
  setOpen: (str: ModuleDialogType | null) => void
  currentRow: ModuleEntity | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ModuleEntity | null>>
}

const ModuleContext = React.createContext<ModuleContextType | null>(null)

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ModuleDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ModuleEntity | null>(null)

  return (
    <ModuleContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ModuleContext>
  )
}

export const useModule = () => {
  const moduleContext = React.useContext(ModuleContext)

  if (!moduleContext) {
    throw new Error('useModule has to be used within <ModuleContext>')
  }

  return moduleContext
}
```

Usar provider quando a tela tiver:

- diálogo de criação, edição, exclusão, importação ou convite;
- `currentRow` compartilhado entre tabela, row actions e dialogs;
- drawer de mutação;
- bulk actions;
- estado de UI que precisa atravessar vários componentes irmãos.

Não usar provider para cache de dados da API. Dados de servidor devem ficar em TanStack Query.

### 6.3 Tabelas

Tabelas devem seguir o padrão do `shadcn-admin` com TanStack Table e componentes reutilizados.

Estrutura esperada:

```txt
components/
  <module-name>-table.tsx
  <module-name>-columns.tsx
  data-table-row-actions.tsx
  data-table-bulk-actions.tsx
```

Regras:

- usar `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead` e `TableCell` de `@/components/ui/table`;
- usar `DataTableToolbar` e `DataTablePagination` de `@/components/data-table`;
- filtros, paginação e ordenação devem usar URL state quando fizer sentido;
- estado local de UI como `rowSelection`, `columnVisibility` e `sorting` pode ficar no componente da tabela;
- colunas devem ficar em arquivo separado;
- ações de linha devem abrir dialogs pelo provider do módulo.

### 6.4 Dialogs, drawers e ações

Cada módulo deve centralizar seus overlays em um componente agregador:

```txt
<module-name>-dialogs.tsx
```

Esse componente deve consumir o provider e decidir qual diálogo renderizar.

Exemplo de responsabilidades:

- renderizar dialog de criação;
- renderizar dialog/drawer de edição com `currentRow`;
- renderizar confirmação de exclusão;
- limpar `currentRow` após fechar dialog de edição/exclusão;
- manter `key` estável por entidade quando necessário.

### 6.5 Data do módulo

A pasta `data/` guarda dados e schemas usados pela UI do módulo.

```txt
data/
  schema.ts
  data.ts
  <module-name>.ts
```

No MVP, pode conter dados mockados como no `shadcn-admin`.

Quando a API real existir:

- `schema.ts` continua válido para tipos e validação de UI;
- dados mockados devem ser substituídos por hooks de query;
- mocks podem permanecer apenas em testes, stories ou fixtures.

### 6.6 Fronteira interna do módulo

Os módulos em `src/modules/*` concentram UI do domínio, contratos, hooks de dados, clients HTTP, serviços de aplicação, políticas, repositories e controllers.

Estrutura base:

```txt
modules/
  <module-name>/
    views/
      index.tsx

    components/
      <module-name>-provider.tsx
      <module-name>-primary-buttons.tsx
      <module-name>-table.tsx
      <module-name>-columns.tsx
      <module-name>-dialogs.tsx
      data-table-row-actions.tsx
      data-table-bulk-actions.tsx

    hooks/
      use-<module-name>.ts
      use-<module-name>-form.ts
      use-<module-name>-mutations.ts
      use-<module-name>-event-stream.ts

    schemas/
      <module-name>-form.schema.ts
      <module-name>.schema.ts
      <module-name>-event.schema.ts

    contracts/
      <module-name>-list.contract.ts

    services/
      <module-name>-api.ts
      <module-name>-query-keys.ts
      <module-name>-invalidations.ts

    server/
      controllers/
        <module-name>.controller.ts
      services/
        <module-name>.service.ts
      repositories/
        <module-name>.repository.ts
        <module-name>.repository.test.ts
      policies/
        <module-name>.policy.ts
      errors/
        <module-name>.errors.ts
        <module-name>.error-handler.ts
      dtos/
        <module-name>.dto.ts
      index.ts
```

Regras:

- `modules/*/views` monta telas e experiência visual;
- `modules/*/components` contém componentes visuais específicos do módulo;
- `modules/*/hooks`, `modules/*/schemas` e `modules/*/services` são a API pública de frontend do módulo;
- `modules/*/contracts` concentra contratos HTTP compartilhados entre frontend e server;
- `modules/*/server` concentra backend interno;
- views e components podem importar hooks, schemas e tipos públicos do próprio módulo;
- outros módulos só devem importar contratos explicitamente públicos, quando necessário;
- nenhuma camada de UI deve importar arquivos privados de `modules/*/server`;
- `modules/*/server` não deve importar componentes React;
- `modules/*/server` não deve importar schemas de formulário do frontend;
- payloads recebidos pelo server devem ser validados com DTOs próprios em `server/dtos`.

### 6.7 Regra obrigatória de shadcn

Usar sempre componentes reutilizados do `shadcn/ui` e componentes compartilhados já existentes no projeto antes de criar markup customizado.

Preferir:

```txt
Button
Input
Select
Table
Dialog
AlertDialog
Drawer
Sheet
DropdownMenu
Badge
Card
Separator
Skeleton
Empty
DataTableToolbar
DataTablePagination
```

Evitar:

```txt
- div estilizada simulando botão;
- span customizado simulando badge;
- tabela HTML manual fora do padrão;
- modal customizado sem Dialog/AlertDialog/Drawer/Sheet;
- empty state manual quando houver componente compartilhado;
- loading manual com div animada quando Skeleton/Spinner resolver;
- cores hardcoded quando existir token semântico.
```

---

## 7. Responsabilidade das camadas do frontend

### 7.1 `views`

A view é a camada de tela.

Responsabilidades:

- montar a página;
- organizar layout;
- consumir hooks;
- renderizar componentes;
- lidar com estados visuais;
- não chamar `fetch` diretamente;
- não acessar Drizzle;
- não conter regra de negócio crítica.

Exemplo:

```tsx
export function ContentProjectsListView() {
  const { projects, isLoading, error, createProject } = useContentProjects()

  return (
    <ContentProjectsProvider>
      <Header fixed>
        <Search className="me-auto" />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Projetos</h2>
            <p className="text-muted-foreground">
              Gerencie conteúdos em produção.
            </p>
          </div>
          <ContentProjectsPrimaryButtons onCreate={createProject} />
        </div>

        <ContentProjectsTable
          data={projects}
          isLoading={isLoading}
          error={error}
        />
      </Main>

      <ContentProjectsDialogs />
    </ContentProjectsProvider>
  )
}
```

---

### 7.2 `components`

Componentes são peças visuais reutilizáveis.

Responsabilidades:

- apresentar dados;
- emitir eventos para a view/hook;
- receber props;
- manter o mínimo possível de regra;
- ser facilmente testáveis e reutilizáveis.

Exemplos:

```txt
content-project-status.tsx
content-project-form.tsx
content-project-table.tsx
content-project-actions.tsx
content-project-empty-state.tsx
```

---

### 7.3 `hooks`

Hooks orquestram comportamento da tela.

Responsabilidades:

- usar TanStack Query;
- usar mutations;
- usar React Hook Form;
- aplicar invalidations;
- controlar loading, error e success;
- disparar toast;
- navegar após sucesso;
- lidar com estado local de UI;
- chamar `services/*-api.ts`.

Hooks **não** devem conter regra de negócio crítica.

Podem conter:

```txt
- desabilitar botão se a UI ainda não tem dados;
- abrir modal de confirmação;
- mostrar toast;
- preparar payload do formulário;
- invalidar lista após mutation;
- controlar steps de wizard.
```

Não devem ser a única fonte de regras como:

```txt
- não publicar sem aprovação;
- não agendar no passado;
- não criar projeto em marca arquivada;
- não gerar vídeo sem roteiro aprovado;
- não publicar sem conta conectada.
```

Essas regras precisam existir no backend.

---

### 7.4 `services` no frontend

Services no frontend são clients HTTP tipados.

Responsabilidades:

- chamar `/api/v1/...`;
- validar response com Zod;
- padronizar erros HTTP;
- esconder detalhes do `fetch`;
- não conhecer UI;
- não conter regra de negócio.

Exemplo:

```ts
export const contentProjectsApi = {
  async list(params?: ListContentProjectsInput) {
    const response = await apiClient.get('/api/v1/content-projects', {
      searchParams: params,
    })

    return listContentProjectsResponseSchema.parse(response)
  },

  async create(input: CreateContentProjectInput) {
    const response = await apiClient.post('/api/v1/content-projects', {
      body: input,
    })

    return createContentProjectResponseSchema.parse(response)
  },

  async generateScript(contentProjectId: string) {
    const response = await apiClient.post(
      `/api/v1/content-projects/${contentProjectId}/generate-script`,
    )

    return generateScriptResponseSchema.parse(response)
  },
}
```

---

### 7.5 `query-keys`

Cada módulo deve centralizar suas query keys.

Exemplo:

```ts
export const contentProjectsQueryKeys = {
  all: ['content-projects'] as const,

  lists: () => [...contentProjectsQueryKeys.all, 'list'] as const,

  list: (filters: ContentProjectFilters) =>
    [...contentProjectsQueryKeys.lists(), filters] as const,

  details: () => [...contentProjectsQueryKeys.all, 'detail'] as const,

  detail: (id: string) => [...contentProjectsQueryKeys.details(), id] as const,
}
```

---

### 7.6 `invalidations`

Cada módulo deve centralizar invalidations.

Exemplo:

```ts
import type { QueryClient } from '@tanstack/react-query'

export const contentProjectsInvalidations = {
  invalidateList: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({
      queryKey: contentProjectsQueryKeys.lists(),
    }),

  invalidateDetail: (queryClient: QueryClient, id: string) =>
    queryClient.invalidateQueries({
      queryKey: contentProjectsQueryKeys.detail(id),
    }),

  invalidateAll: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({
      queryKey: contentProjectsQueryKeys.all,
    }),
}
```

---

## 8. Responsabilidade das camadas do backend

Cada módulo terá uma pasta `server`.

```txt
server/
  controllers/
    <module>.controller.ts

  services/
    <module>.service.ts

  repositories/
    <module>.repository.ts
    <module>.repository.test.ts

  policies/
    <module>.policy.ts

  errors/
    <module>.errors.ts
    <module>.error-handler.ts

  dtos/
    <module>.dto.ts

  index.ts
```

O `server/index.ts` é o barrel público do backend interno do módulo. Rotas em `src/routes/api/v1` devem importar controllers por esse barrel, não por caminhos internos de subpastas.

Exemplo:

```ts
import { UsersController } from '@/modules/users/server'
```

---

### 8.1 Controller

O controller é a borda HTTP do módulo.

Responsabilidades:

- receber `Request`;
- ler params, query e body;
- validar input com contratos HTTP ou DTOs server-side;
- obter usuário autenticado;
- chamar service;
- transformar resultado em JSON;
- delegar transformação de erros para o error handler do módulo;
- não conter regra de negócio extensa;
- não fazer query diretamente.

Exemplo:

```ts
export const contentProjectsController = {
  async create({ request }: ApiHandlerContext) {
    const user = await requireAuth(request)
    const body = await request.json()

    const input = createContentProjectDto.parse(body)

    const result = await contentProjectsService.create({
      userId: user.id,
      input,
    })

    return json(result, { status: 201 })
  },
}
```

---

### 8.2 Service / Use Case

O service é a camada de aplicação.

Responsabilidades:

- executar regras de negócio;
- coordenar transações;
- chamar policies;
- chamar repositories;
- alterar status;
- disparar eventos Inngest;
- coordenar integrações;
- garantir consistência.

Exemplo de regras que ficam no service:

```txt
- marca precisa pertencer ao usuário;
- marca precisa estar ativa;
- projeto não pode avançar se estiver arquivado;
- roteiro precisa estar aprovado antes de gerar narração;
- vídeo precisa estar renderizado antes da publicação;
- publicação precisa ter revisão humana;
- agendamento não pode estar no passado;
- conta YouTube precisa estar conectada.
```

Exemplo:

```ts
export const contentProjectsService = {
  async create({ userId, input }: CreateContentProjectCommand) {
    const brand = await brandsRepository.findById(input.brandId)

    contentProjectsPolicy.ensureCanCreate({
      userId,
      brand,
    })

    const project = await contentProjectsRepository.create({
      userId,
      brandId: input.brandId,
      topic: input.topic,
      status: 'draft',
    })

    await contentProjectTargetsService.createMany({
      contentProjectId: project.id,
      distributionProfileIds: input.distributionProfileIds,
    })

    return contentProjectsMapper.toDto(project)
  },
}
```

---

### 8.2.1 DTOs server-side

DTOs em `server/dtos` representam payloads aceitos pelo backend.

Responsabilidades:

- validar body de `POST`, `PUT` e `PATCH`;
- normalizar entrada aceita pela API;
- ser independentes de formulário e UI;
- exportar tipos usados pelo service.

Regras:

- controller deve validar body com DTOs do server;
- service pode receber tipos derivados dos DTOs;
- server não deve importar `*-form.schema.ts`;
- duplicação entre DTO e form schema é aceitável quando representa fronteiras diferentes.

Exemplo:

```ts
export const createContentProjectDto = z.object({
  topic: z.string().min(3),
  distributionProfileIds: z.array(z.string().uuid()).min(1),
})

export type CreateContentProjectDto = z.infer<typeof createContentProjectDto>
```

---

### 8.3 Repository

O repository é a camada de persistência.

Responsabilidades:

- queries Drizzle;
- inserts;
- updates;
- paginação;
- joins;
- transações simples;
- não conhecer HTTP;
- não conhecer UI;
- não disparar eventos externos.

Exemplo:

```ts
export const contentProjectsRepository = {
  async findManyByUserId(userId: string) {
    return db.query.contentProjects.findMany({
      where: eq(contentProjects.userId, userId),
      orderBy: desc(contentProjects.createdAt),
    })
  },

  async create(input: CreateContentProjectRecord) {
    const [project] = await db.insert(contentProjects).values(input).returning()

    return project
  },
}
```

---

### 8.4 Policy

Policy centraliza autorização e permissões.

Responsabilidades:

- verificar ownership;
- verificar status;
- verificar permissão por usuário;
- lançar erro de domínio quando ação não for permitida.

Exemplo:

```ts
export const contentProjectsPolicy = {
  ensureCanCreate({ userId, brand }: EnsureCanCreateInput) {
    if (!brand) {
      throw new NotFoundError('Marca não encontrada')
    }

    if (brand.userId !== userId) {
      throw new ForbiddenError('Você não tem acesso a esta marca')
    }

    if (brand.status === 'archived') {
      throw new DomainError('Não é possível criar conteúdo em marca arquivada')
    }
  },
}
```

---

### 8.5 Mapper

Mapper converte dados internos em DTOs de API.

Responsabilidades:

- remover campos sensíveis;
- normalizar enums;
- formatar datas;
- mapear database rows para response;
- evitar vazar estrutura interna do banco.

Exemplo:

```ts
export const contentProjectsMapper = {
  toDto(project: ContentProjectRecord): ContentProjectDto {
    return {
      id: project.id,
      title: project.title,
      topic: project.topic,
      status: project.status,
      targets: project.targets,
      createdAt: project.createdAt.toISOString(),
    }
  },
}
```

---

### 8.6 Errors

Cada módulo pode ter erros próprios.

Exemplo:

```ts
export class ContentProjectNotFoundError extends Error {}
export class InvalidContentProjectStatusError extends Error {}
export class ContentProjectAlreadyArchivedError extends Error {}
```

Também deve existir um tratamento global para mapear erros em HTTP:

```txt
DomainError       → 400
UnauthorizedError → 401
ForbiddenError    → 403
NotFoundError     → 404
ConflictError     → 409
ValidationError   → 422
UnknownError      → 500
```

Além dos erros de domínio, cada módulo pode ter um `errors/<module>.error-handler.ts` para converter erros conhecidos em respostas HTTP.

Responsabilidades do error handler:

- converter erros de validação Zod em `400`;
- converter erros de domínio em seus status esperados;
- retornar mensagem genérica para erros desconhecidos;
- logar erros inesperados no servidor;
- evitar vazamento de mensagens internas para o cliente.

Exemplo:

```ts
export function handleModuleControllerError(error: unknown) {
  if (error instanceof ZodError) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (error instanceof ModuleError) {
    return Response.json({ error: error.message }, { status: error.statusCode })
  }

  console.error(error)
  return Response.json({ error: 'Internal server error' }, { status: 500 })
}
```

---

## 9. Server Routes REST

A API deve ser versionada.

Base:

```txt
/api/v1
```

### 9.1 Creator Channels

```txt
GET    /api/v1/creator-channels
POST   /api/v1/creator-channels
GET    /api/v1/creator-channels/:id
PATCH  /api/v1/creator-channels/:id
DELETE /api/v1/creator-channels/:id
```

### 9.2 Distribution Profiles

```txt
GET    /api/v1/distribution-profiles
POST   /api/v1/distribution-profiles
GET    /api/v1/distribution-profiles/:id
PATCH  /api/v1/distribution-profiles/:id
DELETE /api/v1/distribution-profiles/:id
```

### 9.3 Platform Accounts

```txt
GET    /api/v1/platform-accounts
DELETE /api/v1/platform-accounts/:id

POST   /api/v1/platform-accounts/youtube/connect
GET    /api/v1/platform-accounts/youtube/callback
POST   /api/v1/platform-accounts/youtube/refresh
```

### 9.4 Content Projects

```txt
GET    /api/v1/content-projects
POST   /api/v1/content-projects
GET    /api/v1/content-projects/:id
PATCH  /api/v1/content-projects/:id
DELETE /api/v1/content-projects/:id
POST   /api/v1/content-projects/:id/targets
DELETE /api/v1/content-projects/:id/targets/:targetId
```

### 9.5 Content Project Commands

```txt
POST /api/v1/content-projects/:id/generate-ideas
POST /api/v1/content-projects/:id/generate-script
POST /api/v1/content-projects/:id/approve-script
POST /api/v1/content-projects/:id/generate-assets
POST /api/v1/content-projects/:id/render
POST /api/v1/content-projects/:id/approve-publication
```

### 9.6 Media Assets

```txt
GET    /api/v1/media-assets
POST   /api/v1/media-assets
GET    /api/v1/media-assets/:id
DELETE /api/v1/media-assets/:id

POST   /api/v1/media-assets/upload-url
```

### 9.7 Publications

```txt
GET    /api/v1/publications
POST   /api/v1/publications
GET    /api/v1/publications/:id
PATCH  /api/v1/publications/:id

POST   /api/v1/publications/:id/approve
POST   /api/v1/publications/:id/upload
POST   /api/v1/publications/:id/schedule
POST   /api/v1/publications/:id/cancel
POST   /api/v1/publications/:id/check-status
```

### 9.8 Inngest

```txt
POST /api/inngest
GET  /api/inngest
PUT  /api/inngest
```

---

## 10. Rotas HTTP importando controllers

As rotas devem ser finas.

Exemplo conceitual:

```ts
import { createFileRoute } from '@tanstack/react-router'
import { ContentProjectsController } from '@/modules/content-projects/server'

export const Route = createFileRoute('/api/v1/content-projects/')({
  server: {
    handlers: {
      GET: ContentProjectsController.list,
      POST: ContentProjectsController.create,
    },
  },
})
```

A rota não deve conter regra de negócio. Ela deve apenas importar o controller pelo `server/index.ts` do módulo e delegar para ele.

---

## 11. Fluxos principais

### 11.1 Criar projeto de conteúdo

```txt
ContentProjectCreateView
  ↓
useContentProjectForm
  ↓
useCreateContentProjectMutation
  ↓
contentProjectsApi.create(input)
  ↓
POST /api/v1/content-projects
  ↓
contentProjectsController.create()
  ↓
contentProjectsService.create()
  ↓
contentProjectsPolicy.ensureCanCreate()
  ↓
contentProjectsRepository.create()
  ↓
PostgreSQL
```

Após sucesso:

```txt
onSuccess
  ↓
contentProjectsInvalidations.invalidateList()
  ↓
redirect para /content-projects/:id
```

---

### 11.2 Gerar roteiro

```txt
ContentProjectDetailsView
  ↓
useGenerateScriptMutation
  ↓
contentProjectsApi.generateScript(projectId)
  ↓
POST /api/v1/content-projects/:id/generate-script
  ↓
contentProjectsController.generateScript()
  ↓
contentProjectsService.requestScriptGeneration()
  ↓
contentProjectsPolicy.ensureCanGenerateScript()
  ↓
contentProjectsRepository.updateStatus('script_generating')
  ↓
inngest.send('content.script.requested')
  ↓
Inngest generateScript()
  ↓
scriptsRepository.create()
  ↓
contentProjectsRepository.updateStatus('script_generated')
```

---

### 11.3 Aprovar roteiro

```txt
ScriptReviewView
  ↓
useApproveScriptMutation
  ↓
scriptsApi.approve(scriptId)
  ↓
POST /api/v1/content-projects/:id/approve-script
  ↓
contentProjectsController.approveScript()
  ↓
scriptsService.approve()
  ↓
scriptsPolicy.ensureCanApprove()
  ↓
scriptsRepository.markOnlyOneApproved()
  ↓
contentProjectsRepository.updateStatus('script_approved')
```

---

### 11.4 Renderizar vídeo

```txt
ContentProjectDetailsView
  ↓
useRenderVideoMutation
  ↓
contentProjectsApi.render(projectId)
  ↓
POST /api/v1/content-projects/:id/render
  ↓
contentProjectsController.render()
  ↓
videoRenderingService.requestRender()
  ↓
policy.ensureCanRender()
  ↓
contentProjectsRepository.updateStatus('rendering')
  ↓
inngest.send('content.video.render.requested')
  ↓
Inngest renderVideo()
  ↓
FFmpeg worker
  ↓
Storage R2/S3
  ↓
renderedVideosRepository.create()
  ↓
contentProjectsRepository.updateStatus('rendered')
```

---

### 11.5 Publicar/agendar no YouTube

```txt
PublicationReviewView
  ↓
useSchedulePublicationMutation
  ↓
publicationsApi.schedule(publicationId, input)
  ↓
POST /api/v1/publications/:id/schedule
  ↓
publicationsController.schedule()
  ↓
publicationsService.schedule()
  ↓
publicationsPolicy.ensureCanSchedule()
  ↓
platformPublisherRegistry.get('youtube')
  ↓
youtubePublisher.validate()
  ↓
youtubePublisher.upload()
  ↓
youtubePublisher.schedule()
  ↓
platformPublicationsRepository.updateStatus('scheduled')
```

---

## 12. Inngest

Inngest será responsável pela pipeline assíncrona.

### 12.1 Eventos principais

```txt
content.idea.requested
content.script.requested
content.script.generated
content.voiceover.requested
content.voiceover.generated
content.assets.requested
content.assets.generated
content.video.render.requested
content.video.rendered
publication.youtube.upload.requested
publication.youtube.uploaded
publication.youtube.schedule.requested
publication.youtube.scheduled
publication.failed
```

### 12.2 Funções iniciais

```txt
generateIdeasFunction
generateScriptFunction
generateVoiceoverFunction
generateVisualAssetsFunction
renderVideoFunction
uploadYouTubeFunction
scheduleYouTubeFunction
checkYouTubeStatusFunction
```

### 12.3 Regras

- jobs longos não rodam em request HTTP;
- cada step atualiza status no banco;
- cada falha gera log;
- falhas temporárias podem ter retry;
- falhas de autenticação não devem ter retry infinito;
- falhas de quota devem ser reagendadas;
- jobs devem ser idempotentes quando possível.

---

## 13. Platform adapters

A publicação deve usar adapters.

O core do sistema não deve chamar diretamente a API do YouTube.

### 13.1 Interface base

```ts
export interface PlatformPublisher {
  platform: Platform

  validate(input: ValidatePublicationInput): Promise<ValidationResult>

  upload(input: UploadPublicationInput): Promise<UploadPublicationResult>

  schedule(input: SchedulePublicationInput): Promise<SchedulePublicationResult>

  publishNow(input: PublishNowInput): Promise<PublishPublicationResult>

  getStatus(input: GetPublicationStatusInput): Promise<PublicationStatusResult>

  deletePublication?(input: DeletePublicationInput): Promise<void>
}
```

### 13.2 Implementação inicial

```txt
platform-integrations/
  core/
    platform-publisher.ts
    platform-types.ts
    platform-validation.ts
    platform-publisher-registry.ts

  youtube/
    youtube.publisher.ts
    youtube.oauth.ts
    youtube.client.ts
    youtube.schemas.ts
    youtube.validation.ts

  tiktok/
    tiktok.publisher.ts

  instagram/
    instagram.publisher.ts
```

### 13.3 Regra

No MVP, apenas `YouTubePublisher` será implementado.

TikTok e Instagram podem existir apenas como placeholders ou interfaces vazias, sem lógica real.

---

## 14. Modelagem de dados base

### 14.1 `brands`

```txt
id
user_id
name
niche
language
default_tone
default_video_style
status
created_at
updated_at
```

### 14.2 `distribution_profiles`

```txt
id
brand_id
name
slug
platform
content_format
resolution_width
resolution_height
aspect_ratio
min_duration_seconds
max_duration_seconds
target_duration_seconds
timezone
default_title_template
default_description_template
default_tags_json
default_hashtags_json
default_posting_times_json
status
created_at
updated_at
```

### 14.3 `platform_accounts`

```txt
id
user_id
platform
external_account_id
external_account_name
access_token_encrypted
refresh_token_encrypted
token_expires_at
scopes
status
created_at
updated_at
```

### 14.4 `brand_platform_accounts`

```txt
id
brand_id
platform_account_id
platform
external_channel_id
is_default
status
created_at
updated_at
```

### 14.5 `content_projects`

```txt
id
brand_id
title
topic
niche
language
content_type
content_goal
status
created_at
updated_at
```

### 14.6 `content_project_targets`

```txt
id
content_project_id
distribution_profile_id
status
config_snapshot_json
created_at
updated_at
```

### 14.7 `scripts`

```txt
id
content_project_id
version
hook
body
cta
full_script
estimated_duration_seconds
tone
status
created_at
updated_at
```

### 14.8 `media_assets`

```txt
id
content_project_id
type
provider
prompt
file_url
file_size
mime_type
metadata_json
status
created_at
updated_at
```

### 14.9 `rendered_videos`

```txt
id
content_project_target_id
platform
content_format
file_url
duration_seconds
aspect_ratio
resolution
file_size
checksum
status
render_job_id
created_at
updated_at
```

### 14.10 `publication_plans`

```txt
id
content_project_id
content_project_target_id
rendered_video_id
brand_id
status
created_at
updated_at
```

### 14.11 `platform_publications`

```txt
id
publication_plan_id
platform_account_id
platform
content_format
external_publication_id
title
description
tags_json
thumbnail_url
scheduled_at
published_at
privacy_status
scheduling_mode
upload_status
processing_status
platform_metadata_json
error_message
created_at
updated_at
```

### 14.12 `audit_logs`

```txt
id
user_id
entity_type
entity_id
action
metadata_json
created_at
```

---

## 15. Status principais

### 15.1 `content_projects.status`

```txt
draft
idea_generating
idea_generated
script_generating
script_generated
script_approved
assets_generating
assets_generated
voiceover_generating
voiceover_generated
rendering
rendered
ready_for_review
approved
ready_for_publication
failed
archived
```

### 15.2 `scripts.status`

```txt
draft
generated
approved
rejected
archived
```

### 15.3 `rendered_videos.status`

```txt
queued
rendering
rendered
failed
archived
```

### 15.4 `publication_plans.status`

```txt
draft
ready
approved
publishing
scheduled
published
failed
cancelled
```

### 15.5 `platform_publications.upload_status`

```txt
draft
validating
ready
uploading
uploaded
scheduled
published
failed
cancelled
```

### 15.6 `platform_publications.processing_status`

```txt
not_started
processing
processed
rejected
unknown
```

---

## 16. Schemas com Zod

Cada módulo deve separar schemas por uso.

```txt
schemas/
  content-project.schema.ts       # enums e tipos do domínio
  content-project-form.schema.ts  # schema do formulário/frontend
  content-project-event.schema.ts # payloads de eventos Inngest/SSE

contracts/
  content-project-list.contract.ts # request/response HTTP compartilhados

server/
  dtos/
    content-project.dto.ts         # payloads aceitos pelo backend
```

### 16.1 Regra importante

O schema do formulário pode ser diferente do schema da API.

Exemplo:

- formulário pode aceitar string vazia;
- API deve receber dados normalizados;
- backend deve validar com regras mais rígidas.

Regras:

- `schemas/*-form.schema.ts` pertence ao frontend;
- `server/dtos/*.dto.ts` pertence ao backend;
- `contracts/*.contract.ts` pertence ao contrato HTTP compartilhado;
- server não deve importar schema de formulário;
- frontend não deve importar arquivos privados de `server`.

---

## 17. Forms com React Hook Form + Zod

Padrão:

```txt
View
  ↓
use<Module>Form()
  ↓
React Hook Form
  ↓
Zod Resolver
  ↓
Mutation
  ↓
Client API Service
```

Exemplo conceitual:

```ts
export function useContentProjectForm() {
  const createMutation = useCreateContentProjectMutation()

  const form = useForm<ContentProjectFormInput>({
    resolver: zodResolver(contentProjectFormSchema),
    defaultValues: {
      topic: '',
      distributionProfileIds: [],
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    createMutation.mutate(mapFormToApiInput(values))
  })

  return {
    form,
    onSubmit,
    isSubmitting: createMutation.isPending,
  }
}
```

---

## 18. UI/UX com shadcn-admin

O projeto usará `shadcn-admin` como referência de experiência visual, não necessariamente como base copiada integralmente.

Elementos a aproveitar:

- layout de dashboard;
- sidebar;
- topbar;
- navegação interna;
- páginas de listagem;
- tabelas;
- formulários;
- cards;
- dark mode;
- padrões de responsividade;
- páginas de settings;
- visual de admin panel.

### 18.1 Estrutura de navegação inicial

```txt
Dashboard
Marcas
Content Factory
Projetos
Publicações
Agenda
Contas conectadas
Assets
Logs
Settings
```

### 18.2 Componentes compartilhados

```txt
src/components/
  layout/
    header.tsx
    main.tsx
    app-sidebar.tsx

  data-table/
    data-table.tsx
    data-table-pagination.tsx
    data-table-toolbar.tsx

  status-badge/
    status-badge.tsx

  page-header/
    page-header.tsx

  empty-state/
    empty-state.tsx
```

Importar componentes compartilhados pelo alias do projeto:

```ts
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { DataTableToolbar } from '@/components/data-table'
import { Button } from '@/components/ui/button'
```

---

## 19. Context e Providers

Não usar Context por padrão.

Usar apenas quando TanStack Query, URL state ou estado local não resolverem bem. A exceção comum nas telas administrativas é o provider de UI do módulo, usado para coordenar `open`, `currentRow`, dialogs, drawers e bulk actions entre componentes irmãos.

### 19.1 Quando usar Context

```txt
- provider de UI do módulo, como <ModuleProvider>;
- wizard de múltiplos passos;
- Content Factory em lote;
- estado de preview compartilhado;
- editor com muitos subcomponentes;
- fluxo de revisão com várias etapas.
```

### 19.2 Quando não usar Context

```txt
- dados vindos da API;
- listas;
- detalhes;
- cache;
- formulário simples;
- filtros que cabem na URL.
```

Regra:

```txt
Dados do servidor → TanStack Query
Formulário → React Hook Form
Filtros e paginação → Search params do Router
Estado local simples → useState/useReducer
Estado de UI compartilhado da tela → Provider do módulo
Estado de fluxo complexo → Context/Provider
```

---

## 20. Backend desacoplável no futuro

A aplicação começa como monolito modular, mas deve respeitar fronteiras para permitir extração futura.

### 20.1 Regra principal

Somente `src/routes/api` deve conhecer TanStack Start diretamente.

Estas camadas não devem depender do framework:

```txt
modules/*/server/*.service.ts
modules/*/server/*.repository.ts
modules/*/server/*.policy.ts
modules/*/server/*.mapper.ts
modules/*/schemas/*.ts
db/
inngest/
platform-integrations/
```

### 20.2 Extração futura

No futuro, será possível mover para:

```txt
apps/
  web/
  api/

packages/
  database/
  domain/
  api-contracts/
  integrations/
```

Ou para um backend separado:

```txt
apps/
  web/        # TanStack Start ou React puro
  api/        # Fastify, NestJS, Hono, Spring, Go etc.
```

O frontend continuaria chamando:

```txt
/api/v1/...
```

ou uma variável:

```txt
VITE_API_BASE_URL=https://api.creatorfactory.ai
```

---

## 21. Convenções de nomes

### 21.1 Arquivos

Usar kebab-case:

```txt
content-projects-api.ts
content-projects.service.ts
content-projects.repository.ts
content-project-status.tsx
use-content-projects.ts
```

### 21.2 Componentes React

Usar PascalCase:

```tsx
ContentProjectForm
ContentProjectStatus
ContentProjectsTable
```

### 21.3 Hooks

Usar prefixo `use`:

```ts
useContentProjects
useContentProjectForm
useCreateContentProjectMutation
```

### 21.4 APIs frontend

```ts
contentProjectsApi.create()
contentProjectsApi.list()
contentProjectsApi.generateScript()
```

### 21.5 Services backend

```ts
contentProjectsService.create()
contentProjectsService.requestScriptGeneration()
contentProjectsService.archive()
```

### 21.6 Repositories

```ts
contentProjectsRepository.findById()
contentProjectsRepository.findManyByUserId()
contentProjectsRepository.create()
contentProjectsRepository.updateStatus()
```

---

## 22. Regras de negócio no backend

Regras críticas sempre ficam no backend.

Exemplos:

```txt
- não criar projeto em marca arquivada;
- não gerar narração sem roteiro aprovado;
- não renderizar sem assets mínimos;
- não publicar sem vídeo renderizado;
- não publicar sem revisão humana;
- não agendar publicação no passado;
- não publicar sem conta conectada;
- não chamar YouTube fora do adapter;
- não permitir dois roteiros aprovados para o mesmo projeto;
- não permitir status transition inválida.
```

O frontend pode refletir essas regras para melhorar UX, mas nunca deve ser a única proteção.

---

## 23. Status transitions

Toda transição importante deve ser validada.

Exemplo:

```txt
draft
  → idea_generating
  → idea_generated
  → script_generating
  → script_generated
  → script_approved
  → voiceover_generating
  → voiceover_generated
  → assets_generating
  → assets_generated
  → rendering
  → rendered
  → ready_for_review
  → approved
  → ready_for_publication
```

Não permitir:

```txt
draft → published
script_generated → scheduled
rendering → published
failed → published sem reprocessamento
```

---

## 24. Observabilidade e auditoria

Todo fluxo assíncrono deve registrar logs.

### 24.1 O que registrar

```txt
- criação de marca;
- criação de projeto;
- geração de ideia;
- geração de roteiro;
- aprovação de roteiro;
- geração de narração;
- renderização;
- upload;
- agendamento;
- publicação;
- falhas;
- retries;
- alteração de conta conectada;
- erros de autenticação;
- erros de quota;
- ações manuais do usuário.
```

### 24.2 Campos mínimos

```txt
id
user_id
entity_type
entity_id
action
metadata_json
created_at
```

---

## 25. Segurança

### 25.1 Tokens

Tokens OAuth devem ser criptografados.

```txt
access_token_encrypted
refresh_token_encrypted
token_expires_at
scopes
```

### 25.2 Arquivos

Vídeos, thumbnails e narrações devem ficar em storage.

Regras:

```txt
- não salvar binários grandes no banco;
- usar URL assinada quando arquivo for privado;
- registrar origem dos assets;
- registrar provider de IA;
- registrar prompt usado.
```

### 25.3 Autorização

Toda rota `/api/v1` deve validar usuário autenticado, exceto callbacks públicos controlados, como OAuth.

---

## 26. Decisão sobre API contracts

Como a API será HTTP, contratos devem ser claros.

Contratos compartilhados devem ficar dentro do módulo em `contracts/`.

```txt
modules/
  <module-name>/
    contracts/
      <module-name>-list.contract.ts
      index.ts
```

`contracts/` representa apenas o contrato HTTP compartilhado entre frontend e server.

Deve conter:

- schemas de request/response HTTP;
- tipos derivados desses schemas;
- constantes necessárias para validar o contrato público.

Não deve conter:

- schema de formulário;
- DTO server-side de body;
- regra de UI;
- query Drizzle;
- regra de negócio.

Diferença entre camadas:

```txt
contracts/      → contrato HTTP compartilhado entre frontend e server
server/dtos/    → payload aceito pelo backend em create/update
schemas/        → schemas de domínio, UI ou formulário do frontend
server/errors/  → erros de domínio e tradução para HTTP
```

Exemplo:

```txt
modules/users/contracts/user-list.contract.ts
modules/users/server/dtos/users.dto.ts
modules/users/schemas/user-form.schema.ts
```

Cada endpoint deve ter:

```txt
Input schema
Output schema
Error schema
Status codes possíveis
```

Exemplo:

```ts
export const createContentProjectInputSchema = z.object({
  brandId: z.string().uuid(),
  topic: z.string().min(3),
  distributionProfileIds: z.array(z.string().uuid()).min(1),
  contentGoal: z.string().optional(),
})

export const createContentProjectResponseSchema = z.object({
  id: z.string().uuid(),
  topic: z.string(),
  targets: z.array(
    z.object({
      id: z.string().uuid(),
      distributionProfileId: z.string().uuid(),
      status: z.string(),
    }),
  ),
  status: z.string(),
  createdAt: z.string(),
})
```

### 26.1 Listagens paginadas

Endpoints de listagem devem usar paginação server-side.

Query params padrão:

```txt
page   → inteiro >= 1, default 1
limit  → inteiro de 1 a 100, default 20
query  → texto opcional trimado
```

Filtros específicos do módulo devem ser top-level na query string.

Exemplo:

```txt
GET /api/v1/users?page=1&limit=20&query=ana&emailVerified=true
```

Evitar query string aninhada:

```txt
?filters[emailVerified]=true
?pagination[page]=1
```

Resposta padrão de listagem:

```ts
type PaginatedResponse<T> = {
  items: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}
```

Regras:

- não retornar `{ users, total }`, `{ data, count }` ou formatos por módulo;
- usar sempre `{ items, meta }`;
- query params devem ser validados no server;
- `limit` deve ter teto máximo de `100`;
- `query` deve ter limite máximo de tamanho;
- buscas com `LIKE`/`ILIKE` devem escapar curingas (`%`, `_`, `\`) quando a intenção for busca textual;
- filtros booleanos devem aceitar apenas `true` e `false`;
- repository deve aplicar os mesmos filtros na query de dados e na query de `count`;
- ordenação deve ser estável, preferencialmente por data decrescente e id decrescente.

Helpers compartilhados de listagem devem ficar em caminho neutro, não server-only:

```txt
src/lib/list-query.ts
```

Esse helper pode centralizar:

- schema base de `page`, `limit` e `query`;
- parser de boolean query param;
- `toLimitOffset`;
- criação de resposta paginada;
- escape de padrão `LIKE`.

### 26.2 Fluxo recomendado para um novo módulo com listagem

Para um novo módulo com endpoint paginado:

1. Criar contrato em `modules/<module>/contracts/<module>-list.contract.ts`.
2. Estender o schema base de listagem com filtros específicos do módulo.
3. Criar DTOs server-side em `server/dtos` para create/update.
4. Criar controller em `server/controllers` validando contratos e DTOs.
5. Criar service em `server/services` com regras de negócio.
6. Criar repository em `server/repositories` com queries, filtros e count.
7. Criar policy em `server/policies` quando houver autorização específica.
8. Criar erros e error handler em `server/errors`.
9. Criar client HTTP em `services/<module>-api.ts`.
10. Criar hooks de query/mutation e query keys no frontend.

O frontend deve depender do contrato HTTP e do client API, não da implementação interna do server.

---

## 27. MVP técnico recomendado

### Release 0 — Base

```txt
- TanStack Start
- shadcn/ui
- layout inspirado no shadcn-admin
- TanStack Query Provider
- Drizzle + PostgreSQL
- Inngest endpoint
- estrutura modular
```

### Release 1 — Core

```txt
- Auth
- Creator Channels
- Distribution Profiles
- Content Projects
- API REST versionada
- Query/mutation hooks
```

### Release 2 — Geração

```txt
- geração de ideias
- geração de roteiro
- versionamento de roteiro
- aprovação de roteiro
- eventos Inngest
```

### Release 3 — Mídia

```txt
- geração de narração
- assets visuais
- thumbnails
- legendas
- storage
```

### Release 4 — Render

```txt
- FFmpeg worker
- rendered_videos
- preview
- logs
```

### Release 5 — YouTube

```txt
- OAuth YouTube
- Platform Account
- YouTube Publisher Adapter
- upload privado
- agendamento
- status
```

---

## 28. Resumo final da arquitetura

```txt
TanStack Start
  ├── UI com shadcn/ui + shadcn-admin style
  ├── TanStack Router
  ├── TanStack Query
  ├── React Hook Form + Zod
  └── Server Routes REST /api/v1

Monolito Modular
  ├── modules/*/views
  ├── modules/*/hooks
  ├── modules/*/services
  ├── modules/*/schemas
  └── modules/*/server

Backend interno
  ├── controllers
  ├── services/use cases
  ├── policies
  ├── repositories
  └── mappers

Infra
  ├── PostgreSQL
  ├── Drizzle ORM
  ├── Inngest
  ├── FFmpeg worker
  ├── R2/S3 storage
  └── YouTube adapter
```

Frase guia:

> Monolito modular agora, backend desacoplável depois.

Segunda frase guia:

> O frontend conversa com contratos HTTP; o backend interno resolve domínio, regras, persistência e integrações.

---

## 29. Referências técnicas

- TanStack Start: full-stack framework com SSR, streaming, server routes e server functions.
- TanStack Query: gerenciamento de server state, mutations e invalidação de cache.
- Drizzle ORM: ORM TypeScript com suporte a PostgreSQL e migrations via Drizzle Kit.
- Inngest: background jobs, durable functions e workflows assíncronos.
- shadcn-admin: dashboard UI com shadcn/ui e Vite.
- React Hook Form Resolvers: integração com validadores como Zod.
- Zod: schemas TypeScript-first para validação runtime.

---

## 30. Estrutura e Padrões de Testes

Para garantir a confiabilidade da aplicação full-stack (SSR, Server Routes e Controllers), o projeto utiliza **Vitest** dividido em dois ambientes de execução dedicados, isolando os testes de UI do frontend dos testes de integração do banco de dados no backend.

### 30.1 Ambientes e Tipos de Testes

1. **Front-end (Browser Mode):**
   - **Tecnologias:** `@vitest/browser-playwright` + `vitest-browser-react`.
   - **Configuração:** [vitest.config.browser.ts](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/vitest.config.browser.ts).
   - **Foco:** Validação de componentes React, manipulação do DOM real, interações complexas (mouse/foco) e cookies reais dentro de um navegador Chromium headless gerenciado pelo Playwright.
   - **Arquivos:** `src/**/*.test.tsx`.

2. **Back-end e Banco de Dados (Node Mode):**
   - **Tecnologias:** Vitest (Node.js) + Drizzle ORM + PostgreSQL real (Docker).
   - **Configuração:** [vitest.config.node.ts](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/vitest.config.node.ts).
   - **Foco:** Testes unitários de serviços/DTOs, testes de integração de repositórios ([user.repository.integration.test.ts](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/src/modules/users/server/repositories/user.repository.integration.test.ts)) e testes de integração de endpoints REST ([users-api.integration.test.ts](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/src/modules/users/server/controllers/users-api.integration.test.ts)).
   - **Segurança e Concorrência:** Para evitar colisões de chaves primárias e concorrência na execução de migrações em paralelo, os testes de Node rodam em uma única thread sequencial (`fileParallelism: false`).
   - **Arquivos:** `src/**/*.test.ts`.

### 30.2 Banco de Dados para Testes de Integração

Para garantir testes realistas, as requisições de backend utilizam uma base PostgreSQL dedicada:

- **Infraestrutura:** Subida via Docker Compose ([docker-compose.test.yml](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/docker-compose.test.yml)) mapeando a porta `5433` (evitando conflitos com instâncias locais da porta `5432`).
- **Migrações:** Executadas programaticamente no hook `beforeAll` da suíte através do helper [db-test-helper.ts](file:///home/luis/Documentos/Git/DarkVideos/dark_factory/src/test-utils/db-test-helper.ts#L10-L20) (`setupTestDb`).
- **Isolamento de Estado:** Limpeza total via `TRUNCATE ... CASCADE` executada no hook `beforeEach` (`cleanDatabase`).

### 30.3 Convenções e Boas Práticas de Escrita

- **Nomenclatura Descritiva ("should"):** Todas as descrições em blocos `it` devem começar obrigatoriamente com **should** explicando o comportamento esperado do teste de forma clara (ex: `it('should return 404 when the user is not found by ID')`).
- **Estrutura Modular:** Agrupar casos de teste em blocos `describe` aninhados correspondentes a cada método ou handler testado.
- **Dados Dinâmicos:** Usar dados dinâmicos (como geradores de e-mails com `crypto.randomUUID()`) para evitar e-mails duplicados e conflitos de banco de dados entre asserções.
- **Isolamento do Roteamento:** Testes de controladores/API devem ficar dentro do diretório do respectivo módulo (`src/modules/<module>/server/controllers`) e **nunca** no diretório de rotas do TanStack Start (`src/routes`), para evitar que o gerador de rotas tente compilá-los erroneamente como rotas da página.

### 30.4 Scripts de Execução (package.json)

- `npm run db:test:up` - Inicia o contêiner Docker do PostgreSQL de teste.
- `npm run test` - Executa a suíte completa de testes sequencialmente (Node seguido de Browser).
- `npm run test:integration` - Carrega as variáveis de `.env.test` e executa os testes de integração do Node/DB.
- `npm run test:browser` - Executa os testes de frontend rodando no navegador Chromium headless.
- `npm run db:test:down` - Encerra o contêiner Docker do banco de testes.

---

## 31. Decisões de Design e Modelagem de Dados

Para apoiar a publicação automatizada e multiplataforma de conteúdos de forma segura e performática, as seguintes decisões estruturais foram definidas e devem ser respeitadas na codificação do banco de dados e APIs:

### 31.1 Desnormalização de `brand_id` para Otimização de Consultas

A chave estrangeira `brand_id` está intencionalmente desnormalizada e presente em tabelas como `publication_plans` e `distribution_profiles`. Embora esses dados pudessem ser inferidos fazendo o JOIN com `content_projects`, a duplicação direta permite:

- Executar queries de filtragem extremamente rápidas na Agenda Editorial (calendário de postagens) por Marca.
- Simplificar e acelerar a busca direta de perfis e métricas sem encadeamento de múltiplos JOINs custosos.

### 31.2 Reaproveitamento Multiformato (Alvos e Vídeos Renderizados)

Um `content_project` pode possuir múltiplos `content_project_targets`, cada um apontando para um perfil de distribuição e preservando um snapshot da configuração selecionada. Cada alvo pode gerar um ou mais registros em `rendered_videos`, permitindo que um único projeto de conteúdo (com o mesmo roteiro e narração de base) produza formatos diferentes, como Shorts em 9:16 e vídeo longo em 16:9.

### 31.3 Criptografia Simétrica de Tokens de Acesso OAuth

Os tokens armazenados na tabela `platform_accounts` (`access_token_encrypted` e `refresh_token_encrypted`) devem ser criptografados utilizando algoritmos simétricos robustos (ex: `AES-256-GCM`). A chave de decodificação deve ser gerenciada em nível de sistema por meio da variável de ambiente `ENCRYPTION_KEY`, garantindo que credenciais comprometidas em vazamentos de banco de dados permaneçam seguras.

### 31.4 Mapeamento entre Conta Autenticada e Destinos Específicos

A tabela `brand_platform_accounts` serve como ponte de muitos-para-muitos. Isso resolve o cenário onde um único login de rede social (ex: login de agência no Google OAuth registrado em `platform_accounts`) gerencia múltiplos canais do YouTube reais (IDs individuais guardados em `external_channel_id`). O sistema vincula a Marca do usuário a um destino específico de publicação, não apenas ao login genérico.
