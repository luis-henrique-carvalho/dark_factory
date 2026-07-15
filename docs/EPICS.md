# Épicos — Creator Factory AI

## Visão geral dos épicos

O MVP será dividido em épicos que cobrem:

1. Fundação técnica.
2. Autenticação e estrutura base.
3. Canais internos.
4. Integração com YouTube.
5. Projetos de conteúdo.
6. Geração de ideias e roteiros com IA.
7. Geração de mídia.
8. Renderização de vídeos.
9. Publicação e agendamento.
10. Revisão, qualidade e segurança.
11. Observabilidade.
12. Preparação para múltiplas plataformas futuras.

---

# EPIC 01 — Fundação técnica da aplicação

## Objetivo

Criar a base técnica do projeto com TanStack Start, Drizzle, PostgreSQL, Inngest, estrutura modular e padrões iniciais de arquitetura.

## Prioridade

**P0 — Essencial para o MVP**

## Descrição

Este épico prepara o projeto para desenvolvimento sustentável. A aplicação deve nascer organizada por módulos, com schema versionado, migrations, variáveis de ambiente, conexão com banco, estrutura de server functions, server routes e endpoint inicial do Inngest.

## Entregáveis

- Setup do projeto com TanStack Start.
- Configuração do TypeScript.
- Configuração do PostgreSQL.
- Configuração do Drizzle ORM.
- Configuração do Drizzle Kit.
- Estrutura inicial de pastas.
- Configuração do Inngest.
- Endpoint `/api/inngest`.
- Configuração de variáveis de ambiente.
- Setup de lint/format.
- Setup de aliases de importação.
- Health check básico da aplicação.

## User stories

### US-001 — Inicializar aplicação

Como desenvolvedor, quero iniciar o projeto com TanStack Start para ter uma base full-stack React moderna.

### US-002 — Conectar banco de dados

Como desenvolvedor, quero conectar PostgreSQL com Drizzle para persistir dados da plataforma.

### US-003 — Criar estrutura modular

Como desenvolvedor, quero organizar o código por domínio para facilitar manutenção e evolução futura.

### US-004 — Configurar Inngest

Como desenvolvedor, quero configurar Inngest para executar workflows assíncronos da fábrica de conteúdo.

## Critérios de aceite

- A aplicação roda localmente.
- O banco conecta corretamente.
- Drizzle consegue executar migrations.
- Existe endpoint funcional do Inngest.
- A estrutura de pastas segue arquitetura modular.
- Variáveis sensíveis não ficam expostas no client.

---

# EPIC 02 — Autenticação e usuário

## Objetivo

Permitir que o usuário acesse a plataforma de forma autenticada e tenha seus próprios dados isolados.

## Prioridade

**P0 — Essencial para o MVP**

## Descrição

Mesmo sendo uma plataforma pessoal inicialmente, o sistema deve ter autenticação desde o começo para preparar o domínio para uso futuro como SaaS.

## Entregáveis

- Login.
- Logout.
- Sessão autenticada.
- Proteção de rotas privadas.
- Tabela de usuários.
- Middleware ou validação de acesso.
- Associação de entidades ao usuário.

## User stories

### US-005 — Fazer login

Como usuário, quero fazer login para acessar minha plataforma de criação de conteúdo.

### US-006 — Proteger dashboard

Como usuário, quero que apenas eu acesse meus canais, projetos e publicações.

### US-007 — Associar dados ao usuário

Como sistema, quero associar canais, contas e projetos ao usuário autenticado.

## Critérios de aceite

- Usuário autenticado acessa dashboard.
- Usuário não autenticado é redirecionado para login.
- Canais e projetos possuem `user_id` ou herdam vínculo de usuário.
- Sessões funcionam corretamente.

---

# EPIC 03 — Gestão de marcas

## Objetivo

Permitir que o usuário crie e gerencie marcas de conteúdo.

## Prioridade

**P0 — Essencial para o MVP**

## Descrição

Uma marca representa uma linha editorial ou marca de conteúdo dentro da plataforma. Ela não deve ser acoplada diretamente ao YouTube, pois futuramente poderá publicar em várias plataformas.
Para otimizar a visualização de métricas e calendários por marca, a chave estrangeira `brand_id` é desnormalizada e incluída diretamente em tabelas associadas como `publication_plans` e `distribution_profiles`.

## Entregáveis

- Criar marca.
- Listar marcas.
- Editar marca.
- Arquivar marca.
- Definir nicho.
- Definir idioma.
- Definir tom padrão.
- Definir estilo visual padrão.
- Definir formato padrão.

## Entidade principal

```text
brands
```

## User stories

### US-008 — Criar marca

Como usuário, quero criar uma marca para organizar meus conteúdos por nicho.

### US-009 — Definir nicho da marca

Como usuário, quero definir o nicho da marca para orientar a geração de ideias e roteiros.

### US-010 — Definir idioma e tom

Como usuário, quero configurar idioma e tom padrão para padronizar os vídeos gerados.

### US-011 — Arquivar marca

Como usuário, quero arquivar marcas que não estou mais usando.

## Critérios de aceite

- O usuário consegue criar uma marca.
- A marca possui nome, nicho, idioma e status.
- A marca pode ser editada.
- A marca pode ser arquivada.
- Marcas arquivadas não aparecem como opção padrão em novos projetos.

---

# EPIC 04 — Perfis de distribuição

## Objetivo

Criar templates de distribuição que definem como um conteúdo será preparado para uma plataforma e um formato específicos.

## Prioridade

**P0 — Essencial para o MVP**

## Descrição

O sistema separa marca, conteúdo, plataforma e formato. Uma marca pode possuir vários perfis de distribuição, como YouTube Shorts e YouTube Long Form.

`platform` representa o destino externo, enquanto `content_format` representa o formato do conteúdo. Assim, o modelo pode evoluir para combinações como YouTube + Short, YouTube + Long, TikTok + Short e Instagram + Reel sem transformar cada combinação em uma plataforma diferente.

Um projeto de conteúdo pode selecionar múltiplos perfis através de alvos de distribuição. Cada alvo representa uma versão desejada do projeto e pode gerar um ou mais vídeos renderizados.

## Entregáveis

- Criar, listar, editar e arquivar perfil de distribuição.
- Configurar plataforma e formato.
- Configurar resolução e aspect ratio.
- Configurar duração mínima, máxima e alvo.
- Configurar timezone e horários padrão de postagem.
- Configurar templates de título e descrição.
- Configurar tags e hashtags padrão.
- Selecionar múltiplos perfis na criação de um projeto.
- Preservar um snapshot da configuração usada por cada alvo do projeto.

## Entidades principais

```text
distribution_profiles
content_project_targets
```

## Perfis iniciais

```text
platform: youtube
content_format: short

platform: youtube
content_format: long
```

`youtube_short` e `youtube_long` podem ser usados como slugs ou códigos internos, mas não representam plataformas distintas.

## User stories

### US-012 — Criar perfil de distribuição

Como usuário, quero criar um perfil de distribuição associado a uma marca, definindo plataforma, formato e configurações padrão.

### US-013 — Configurar perfis Shorts e Long Form

Como usuário, quero configurar perfis de YouTube Shorts e YouTube Long Form com resoluções, proporções e durações diferentes.

### US-014 — Definir horários padrão

Como usuário, quero definir timezone, dias e horários padrão de postagem para facilitar o agendamento.

### US-014A — Selecionar múltiplos perfis no projeto

Como usuário, quero selecionar Shorts e Long Form para um mesmo projeto e gerar versões diferentes reutilizando o mesmo conteúdo-base.

### US-014B — Preservar configuração do projeto

Como sistema, quero salvar um snapshot da configuração do perfil no alvo do projeto para que alterações futuras no perfil não modifiquem trabalhos antigos.

## Regras de negócio

- Um perfil pertence a uma única marca.
- O slug deve ser único dentro da marca (`UNIQUE (brand_id, slug)`).
- Uma marca pode ter vários perfis para a mesma combinação de plataforma e formato, desde que possuam slugs diferentes.
- Perfil arquivado não pode ser selecionado em novos projetos.
- Perfil arquivado pode continuar referenciado por projetos existentes.
- O perfil fornece defaults; o horário efetivo pertence ao plano de publicação.
- Cada alvo de projeto deve armazenar a configuração usada no momento da seleção.
- Resolução, aspect ratio e duração devem ser validados antes da renderização.
- Horários padrão devem incluir dias e timezone explícito.
- Todo acesso a perfil deve validar que o usuário possui a marca associada.

## Critérios de aceite

- Uma marca pode criar, editar, listar e arquivar múltiplos perfis.
- Shorts e Long Form possuem configurações independentes.
- Um projeto pode selecionar um ou mais perfis de distribuição.
- A seleção cria alvos de distribuição vinculados ao projeto.
- Cada alvo mantém um snapshot imutável da configuração selecionada.
- O sistema não trata Shorts e Long Form como plataformas diferentes.
- Perfil de outra marca não pode ser usado.
- Perfil arquivado não aparece para novos projetos.

---

# EPIC 05 — Integração com contas de plataforma

## Objetivo

Criar a estrutura genérica de contas externas conectadas, começando pelo YouTube.

## Prioridade

**P0 — Essencial para o MVP**

## Descrição

Este épico prepara o sistema para conectar contas externas. No MVP, apenas YouTube será implementado, mas a modelagem deve suportar TikTok, Instagram, Kwai e Facebook no futuro.
Por motivos de segurança, todos os tokens de acesso e de atualização OAuth serão armazenados criptografados simetricamente usando chave de ambiente (`ENCRYPTION_KEY`). O vínculo entre marca e canais físicos específicos de publicação será feito de forma flexível através da tabela de ligação `brand_platform_accounts`.

## Entregáveis

- Tabela `platform_accounts`.
- Tabela `brand_platform_accounts`.
- Enum de plataformas.
- Status de conexão.
- Armazenamento criptografado de tokens.
- Associação entre marca e conta externa.
- Tela de contas conectadas.

## User stories

### US-015 — Listar contas conectadas

Como usuário, quero visualizar contas externas conectadas à plataforma.

### US-016 — Associar conta à marca

Como usuário, quero associar uma conta externa a uma marca.

### US-017 — Definir conta padrão

Como usuário, quero definir uma conta padrão de publicação para cada marca e plataforma.

## Critérios de aceite

- O sistema possui estrutura genérica para plataformas.
- A marca pode ser associada a uma conta externa.
- Não é possível publicar sem conta conectada.
- Tokens são armazenados de forma segura.

---

# EPIC 06 — OAuth e conexão com YouTube

## Objetivo

Permitir que o usuário conecte uma conta/canal do YouTube à plataforma.

## Prioridade

**P0 — Essencial para o MVP**

## Descrição

O sistema deve permitir autorização via Google OAuth para obter permissões necessárias de upload e gerenciamento de vídeos.

## Entregáveis

- Fluxo OAuth Google/YouTube.
- Callback OAuth.
- Persistência de access token.
- Persistência de refresh token.
- Renovação automática de token.
- Revogação/desconexão.
- Validação de escopos.
- Exibição de status da conexão.

## User stories

### US-018 — Conectar YouTube

Como usuário, quero conectar meu canal do YouTube para permitir upload e agendamento.

### US-019 — Renovar token

Como sistema, quero renovar tokens expirados para evitar falhas de publicação.

### US-020 — Reconectar conta

Como usuário, quero reconectar o YouTube caso a autorização expire ou seja revogada.

## Critérios de aceite

- Usuário consegue iniciar fluxo OAuth.
- Sistema recebe callback com sucesso.
- Tokens são salvos criptografados.
- Sistema identifica conta/canal conectado.
- Conta aparece como `connected`.
- Falha de renovação muda status para `reauth_required`.

---

# EPIC 07 — Projetos de conteúdo

## Objetivo

Permitir que o usuário crie e gerencie projetos de conteúdo, que representam vídeos em produção.

## Prioridade

**P0 — Essencial para o MVP**

## Descrição

Um projeto de conteúdo é a unidade principal da fábrica. Ele agrupa ideia, roteiro, assets, vídeo renderizado e publicação.

## Entregáveis

- Criar projeto.
- Listar projetos.
- Editar projeto.
- Selecionar marca.
- Selecionar um ou mais perfis de distribuição.
- Definir tema.
- Definir objetivo.
- Definir status.
- Arquivar projeto.

## Entidade principal

```text
content_projects
```

## User stories

### US-021 — Criar projeto de conteúdo

Como usuário, quero criar um projeto para produzir um novo vídeo.

### US-022 — Escolher alvos de distribuição

Como usuário, quero escolher um ou mais perfis de distribuição para gerar versões do mesmo projeto em formatos diferentes.

### US-023 — Acompanhar status

Como usuário, quero acompanhar em qual etapa o projeto está.

## Critérios de aceite

- Projeto pertence a uma marca.
- Projeto possui um ou mais alvos de distribuição.
- Projeto possui status.
- Projeto pode evoluir pelos status da pipeline.
- Projeto arquivado não entra na fila de produção.

---

# EPIC 08 — Geração de ideias com IA

## Objetivo

Gerar ideias de vídeos baseadas no nicho, marca, formato e objetivo do conteúdo.

## Prioridade

**P0 — Essencial para o MVP**

## Descrição

O usuário deve conseguir pedir ideias para uma marca e formato específico. A IA deve gerar ideias com título preliminar, ângulo, gancho e justificativa.

## Entregáveis

- Prompt de geração de ideias.
- Versionamento de prompt.
- Geração de múltiplas ideias.
- Escolha de ideia.
- Salvamento da ideia no projeto.
- Regeneração.
- Histórico de ideias.

## User stories

### US-024 — Gerar ideias

Como usuário, quero gerar ideias de vídeos para uma marca específica.

### US-025 — Escolher ideia

Como usuário, quero selecionar uma ideia para virar roteiro.

### US-026 — Regenerar ideias

Como usuário, quero regenerar ideias quando as sugestões forem ruins.

## Critérios de aceite

- IA gera ideias com base na marca.
- Ideias respeitam idioma, nicho e formato.
- Usuário consegue selecionar uma ideia.
- Ideias geradas são persistidas.
- O prompt usado é registrado.

---

# EPIC 09 — Geração e versionamento de roteiros

## Objetivo

Gerar roteiros completos com IA e permitir versionamento, revisão e aprovação.

## Prioridade

**P0 — Essencial para o MVP**

## Descrição

A plataforma deve gerar roteiros para Shorts e vídeos longos. Cada roteiro deve ter hook, corpo, CTA, duração estimada e versão.

## Entregáveis

- Geração de roteiro.
- Versionamento de roteiro.
- Aprovação de roteiro.
- Rejeição de roteiro.
- Regeneração.
- Edição manual.
- Estimativa de duração.
- Separação por blocos/cenas.

## Entidade principal

```text
scripts
```

## User stories

### US-027 — Gerar roteiro

Como usuário, quero gerar um roteiro completo a partir de uma ideia aprovada.

### US-028 — Editar roteiro

Como usuário, quero editar o roteiro antes de aprovar.

### US-029 — Aprovar roteiro

Como usuário, quero aprovar uma versão do roteiro para avançar para geração de mídia.

### US-030 — Criar nova versão

Como usuário, quero gerar uma nova versão do roteiro sem perder a anterior.

## Critérios de aceite

- Projeto pode ter múltiplas versões de roteiro.
- Apenas uma versão pode estar aprovada.
- O roteiro aprovado é usado nas etapas seguintes.
- O roteiro possui duração estimada.
- O roteiro possui hook, corpo e CTA.

---

# EPIC 10 — Vídeos de referência e fórmulas criativas

## Objetivo

Permitir cadastrar vídeos de referência e extrair fórmulas criativas sem copiar o conteúdo original.

## Prioridade

**P1 — Importante, mas pode vir após o fluxo básico de geração**

## Descrição

Este módulo permite que o usuário salve vídeos de referência, cole transcrições e peça para a IA extrair padrões narrativos, ganchos, emoções e estruturas reutilizáveis.

## Entregáveis

- Cadastro de vídeo de referência.
- Campo de URL.
- Campo de transcrição.
- Análise da fórmula criativa.
- Salvamento de `formula_json`.
- Uso da fórmula para gerar ideias.
- Validação de originalidade.

## Entidade principal

```text
reference_videos
```

## User stories

### US-031 — Cadastrar vídeo de referência

Como usuário, quero cadastrar um vídeo viral como referência criativa.

### US-032 — Colar transcrição

Como usuário, quero colar uma transcrição para que a IA analise a estrutura do vídeo.

### US-033 — Extrair fórmula

Como usuário, quero extrair a fórmula narrativa do vídeo para gerar novas ideias originais.

## Critérios de aceite

- Usuário consegue cadastrar vídeo de referência.
- Sistema aceita transcrição manual.
- IA gera fórmula abstrata, não cópia.
- Fórmula pode ser usada na geração de ideias.
- Conteúdo com similaridade alta deve ser sinalizado.

---

# EPIC 11 — Geração de narração

## Objetivo

Gerar áudio de narração a partir do roteiro aprovado.

## Prioridade

**P0 — Essencial para o MVP com vídeo automático**

## Descrição

A plataforma deve transformar o roteiro aprovado em narração usando um provider de TTS, salvando o arquivo no storage e registrando provider, parâmetros e status.

## Entregáveis

- Interface `VoiceGenerationProvider`.
- Geração de voiceover.
- Salvamento do áudio.
- Status de geração.
- Retry em caso de falha.
- Configuração de voz por marca.
- Preview da narração.

## Entidade principal

```text
media_assets
type = voiceover
```

## User stories

### US-034 — Gerar narração

Como usuário, quero gerar a narração do roteiro aprovado.

### US-035 — Ouvir preview

Como usuário, quero ouvir a narração antes de renderizar o vídeo.

### US-036 — Regenerar narração

Como usuário, quero regenerar a narração caso o resultado fique ruim.

## Critérios de aceite

- Narração é gerada a partir do roteiro aprovado.
- Arquivo é salvo no storage.
- Asset registra provider e metadata.
- Usuário consegue escutar preview.
- Falha permite retry.

---

# EPIC 12 — Geração de assets visuais e thumbnail

## Objetivo

Gerar ou organizar assets visuais necessários para montar o vídeo.

## Prioridade

**P0 — Essencial para o MVP**

## Descrição

A plataforma deve gerar prompts de cenas, imagens, B-rolls ou permitir upload/importação de assets. Também deve gerar thumbnail ou prompt de thumbnail.

## Entregáveis

- Plano de cenas.
- Prompts visuais.
- Geração ou importação de imagens.
- Registro de assets.
- Geração de thumbnail.
- Preview de assets.
- Organização por projeto.

## Entidade principal

```text
media_assets
```

## User stories

### US-037 — Gerar plano de cenas

Como usuário, quero gerar uma lista de cenas com base no roteiro.

### US-038 — Gerar prompts visuais

Como usuário, quero receber prompts para criar imagens ou vídeos curtos.

### US-039 — Salvar thumbnail

Como usuário, quero gerar ou salvar uma thumbnail para usar na publicação.

## Critérios de aceite

- Cada asset pertence a um projeto.
- Asset possui tipo, provider, prompt e URL.
- Thumbnail pode ser associada à publicação.
- Assets podem ser usados na renderização.

---

# EPIC 13 — Legendas e arquivos auxiliares

## Objetivo

Gerar legendas e arquivos auxiliares para compor o vídeo final.

## Prioridade

**P1 — Importante para qualidade do MVP**

## Descrição

O sistema deve gerar legendas sincronizadas ou, no mínimo, arquivos de legenda com base no roteiro/narração.

## Entregáveis

- Geração de legenda.
- Arquivo `.srt` ou `.vtt`.
- Associação da legenda ao projeto.
- Opção de legenda embutida no vídeo.
- Ajuste de estilo básico para Shorts.

## User stories

### US-040 — Gerar legenda

Como usuário, quero gerar legenda para melhorar retenção dos vídeos.

### US-041 — Embutir legenda

Como usuário, quero embutir legenda no vídeo final.

## Critérios de aceite

- Legenda é salva como asset.
- Legenda pode ser usada pelo renderizador.
- Vídeos Shorts podem ter legenda embutida.
- Vídeos longos podem ter legenda como arquivo auxiliar.

---

# EPIC 14 — Renderização de vídeo

## Objetivo

Renderizar o vídeo final em MP4 usando roteiro, narração, assets visuais, legendas e configurações do formato.

## Prioridade

**P0 — Essencial para o MVP**

## Descrição

A renderização deve acontecer fora do ciclo de request, em worker/container com FFmpeg, orquestrada por Inngest.

## Entregáveis

- Interface de renderização.
- Worker ou serviço FFmpeg.
- Renderização Shorts 9:16.
- Renderização Long Form 16:9.
- Salvamento do MP4.
- Registro em `rendered_videos`.
- Retry.
- Logs de renderização.
- Preview do vídeo final.

## Entidade principal

```text
rendered_videos
```

## User stories

### US-042 — Renderizar Shorts

Como usuário, quero renderizar um vídeo vertical para YouTube Shorts.

### US-043 — Renderizar vídeo longo

Como usuário, quero renderizar um vídeo horizontal para YouTube Long Form.

### US-044 — Assistir preview

Como usuário, quero assistir o vídeo renderizado antes de aprovar publicação.

### US-045 — Reprocessar vídeo

Como usuário, quero reprocessar o vídeo se a renderização falhar ou ficar ruim.

## Critérios de aceite

- Renderização não roda em request web.
- Vídeo final é salvo no storage.
- Sistema registra duração, resolução e tamanho.
- Usuário consegue visualizar preview.
- Falha gera log e permite retry.

---

# EPIC 15 — Orquestração da Content Factory com Inngest

## Objetivo

Criar a pipeline assíncrona que orquestra geração de conteúdo, mídia, renderização e publicação.

## Prioridade

**P0 — Essencial para o MVP**

## Descrição

O sistema deve usar eventos e funções Inngest para controlar a esteira de produção.

## Entregáveis

- Eventos de domínio.
- Funções Inngest.
- Steps com retry.
- Atualização de status no banco.
- Logs por etapa.
- Reprocessamento.
- Controle de falhas.

## Eventos principais

```text
content.project.created
content.idea.requested
content.script.generated
content.script.approved
content.assets.requested
content.voiceover.generated
content.video.render.requested
content.video.rendered
publication.approved
publication.youtube.upload.requested
publication.youtube.scheduled
publication.failed
```

## User stories

### US-046 — Executar pipeline

Como sistema, quero executar as etapas de produção em ordem confiável.

### US-047 — Atualizar status

Como usuário, quero ver o status do projeto em cada etapa.

### US-048 — Reexecutar etapa

Como usuário, quero reexecutar uma etapa que falhou.

## Critérios de aceite

- Cada etapa atualiza status no banco.
- Falhas são registradas.
- Retry funciona em falhas temporárias.
- Jobs longos não travam a aplicação web.
- Usuário consegue acompanhar progresso.

---

# EPIC 16 — Planos de publicação

## Objetivo

Criar a estrutura genérica de publicação, separando conteúdo renderizado de destino externo.

## Prioridade

**P0 — Essencial para o MVP**

## Descrição

Antes de publicar, o sistema deve criar um plano de publicação associado a um vídeo renderizado. Esse plano poderá gerar uma ou mais publicações específicas por plataforma.

## Entidades principais

```text
publication_plans
platform_publications
```

## Entregáveis

- Criar plano de publicação.
- Associar vídeo renderizado.
- Associar marca.
- Criar publicação YouTube.
- Status de publicação.
- Dados de título, descrição, tags e thumbnail.
- Data de agendamento.

## User stories

### US-049 — Criar plano de publicação

Como usuário, quero criar um plano de publicação para um vídeo aprovado.

### US-050 — Definir metadados

Como usuário, quero revisar título, descrição, tags e thumbnail antes de publicar.

### US-051 — Definir data de agendamento

Como usuário, quero escolher quando o vídeo será publicado.

## Critérios de aceite

- Plano de publicação exige vídeo renderizado.
- Plano exige projeto aprovado.
- Publicação específica fica em `platform_publications`.
- No MVP, plataforma permitida é YouTube.
- Agendamento no passado é bloqueado.

---

# EPIC 17 — YouTube Publisher Adapter

## Objetivo

Implementar o adapter responsável por upload, agendamento e consulta de status no YouTube.

## Prioridade

**P0 — Essencial para o MVP**

## Descrição

O core da aplicação deve chamar uma interface genérica de publicação. A implementação concreta do MVP será `YouTubePublisher`.

## Entregáveis

- Interface `PlatformPublisher`.
- Classe `YouTubePublisher`.
- Validação de publicação YouTube.
- Upload privado.
- Agendamento com `publishAt`.
- Consulta de status.
- Tratamento de erros.
- Registro de `external_publication_id`.

## User stories

### US-052 — Validar publicação

Como sistema, quero validar se o vídeo e metadados estão adequados para o YouTube.

### US-053 — Fazer upload privado

Como usuário, quero enviar o vídeo para o YouTube como privado.

### US-054 — Agendar publicação

Como usuário, quero agendar o vídeo para uma data futura.

### US-055 — Consultar status

Como usuário, quero ver se o vídeo foi processado, agendado ou publicado.

## Critérios de aceite

- Adapter implementa interface genérica.
- Upload retorna ID externo do YouTube.
- Vídeo é enviado como privado.
- Agendamento usa data futura.
- Erros de quota/autenticação são registrados.
- Sistema não chama API do YouTube fora do adapter.

---

# EPIC 18 — Revisão humana e checklist de publicação

## Objetivo

Impedir publicação automática sem revisão e reduzir risco de conteúdo ruim, repetitivo ou problemático.

## Prioridade

**P0 — Essencial para o MVP**

## Descrição

Antes de publicar/agendar, o usuário deve revisar vídeo, roteiro, metadados e riscos.

## Entregáveis

- Tela de revisão.
- Checklist de publicação.
- Aprovação manual.
- Rejeição.
- Histórico de aprovação.
- Bloqueio de publicação sem aprovação.
- Flags de risco.

## Checklist

```text
- Roteiro está original?
- Conteúdo não copia vídeo de referência?
- Vídeo tem valor próprio?
- Título não é enganoso?
- Descrição está coerente?
- Tags estão adequadas?
- Usa IA realista?
- Precisa marcar conteúdo sintético?
- Há risco sensível?
- Narração está correta?
- Thumbnail está adequada?
- Horário está correto?
```

## User stories

### US-056 — Revisar vídeo

Como usuário, quero revisar o vídeo antes de publicar.

### US-057 — Aprovar publicação

Como usuário, quero aprovar manualmente uma publicação.

### US-058 — Bloquear publicação sem revisão

Como sistema, quero impedir publicação de vídeos não aprovados.

## Critérios de aceite

- Publicação sem aprovação é bloqueada.
- Aprovação fica registrada.
- Checklist aparece antes de publicar.
- Usuário pode rejeitar e voltar etapas.

---

# EPIC 19 — Originalidade, qualidade e policy checks

## Objetivo

Criar validações para reduzir risco de conteúdo copiado, repetitivo, enganoso ou problemático.

## Prioridade

**P1 — Importante para proteger canais e qualidade**

## Descrição

A plataforma deve avaliar o conteúdo antes da publicação e sinalizar riscos.

## Entregáveis

- Score de originalidade.
- Similaridade textual.
- Flag de conteúdo sensível.
- Flag de conteúdo sintético.
- Flag de risco factual.
- Validação de clickbait enganoso.
- Validação de repetição.
- Sugestões de melhoria.

## User stories

### US-059 — Ver score de originalidade

Como usuário, quero saber se meu roteiro parece original.

### US-060 — Detectar risco de cópia

Como sistema, quero sinalizar quando um roteiro está parecido demais com referência.

### US-061 — Detectar conteúdo sensível

Como sistema, quero sinalizar temas que exigem revisão mais cuidadosa.

## Critérios de aceite

- Sistema gera flags de risco.
- Conteúdo de alto risco exige revisão explícita.
- Similaridade alta bloqueia publicação ou exige ajuste.
- O usuário vê motivo da flag.

---

# EPIC 20 — Agenda editorial

## Objetivo

Permitir visualizar e gerenciar publicações programadas.

## Prioridade

**P1 — Importante para operação**

## Descrição

A agenda editorial ajuda o usuário a planejar vídeos por data, marca e formato.

## Entregáveis

- Calendário de publicações.
- Lista de agendados.
- Filtro por marca.
- Filtro por status.
- Filtro por formato.
- Reagendamento.
- Cancelamento de publicação interna.
- Visualização semanal/mensal.

## User stories

### US-062 — Ver calendário

Como usuário, quero visualizar os vídeos agendados em calendário.

### US-063 — Reagendar publicação

Como usuário, quero mudar a data de uma publicação antes dela ir ao ar.

### US-064 — Filtrar por marca

Como usuário, quero filtrar a agenda por marca.

## Critérios de aceite

- Publicações agendadas aparecem no calendário.
- Usuário pode filtrar por marca e formato.
- Agendamentos no passado são bloqueados.
- Reagendamento atualiza status e dados da plataforma quando aplicável.

---

# EPIC 21 — Logs, auditoria e observabilidade

## Objetivo

Registrar ações, eventos, erros e histórico de execução dos jobs.

## Prioridade

**P0 — Essencial para depuração do MVP**

## Descrição

Como a plataforma terá muitos jobs assíncronos, é essencial ter logs claros para entender falhas de IA, renderização, upload e agendamento.

## Entregáveis

- Tabela `audit_logs`.
- Logs de jobs.
- Logs de erro.
- Histórico de status.
- Tela básica de logs.
- Registro de payload resumido.
- Registro de tempo por etapa.
- Registro de provider usado.

## User stories

### US-065 — Ver logs de um projeto

Como usuário, quero ver logs de execução de um projeto para entender falhas.

### US-066 — Ver erro de publicação

Como usuário, quero entender por que um upload ou agendamento falhou.

### US-067 — Auditar aprovação

Como sistema, quero registrar quem aprovou uma publicação e quando.

## Critérios de aceite

- Eventos importantes são registrados.
- Erros têm mensagem legível.
- Logs podem ser vistos por projeto.
- Jobs registram início, fim e falha.
- Aprovações ficam auditadas.

---

# EPIC 22 — Storage de arquivos

## Objetivo

Gerenciar upload, armazenamento e recuperação de arquivos gerados ou importados.

## Prioridade

**P0 — Essencial para mídia e vídeo final**

## Descrição

A plataforma deve salvar narrações, imagens, legendas, thumbnails e vídeos renderizados em storage externo.

## Entregáveis

- Integração com S3/R2.
- Upload de arquivos.
- URLs persistentes.
- URLs assinadas quando necessário.
- Metadata de arquivos.
- Remoção/arquivamento.
- Organização por projeto.

## User stories

### US-068 — Salvar narração

Como sistema, quero salvar arquivos de narração no storage.

### US-069 — Salvar vídeo final

Como sistema, quero salvar o MP4 final renderizado.

### US-070 — Acessar preview

Como usuário, quero acessar previews de assets e vídeos.

## Critérios de aceite

- Arquivos são salvos fora do banco.
- Banco guarda URL e metadata.
- Vídeos grandes são suportados.
- Assets são vinculados ao projeto correto.

---

# EPIC 23 — Configuração de providers de IA

## Objetivo

Permitir configurar e desacoplar providers de IA para texto, voz, imagem e vídeo.

## Prioridade

**P1 — Importante para flexibilidade**

## Descrição

O sistema deve evitar acoplamento forte a um único provider de IA.

## Entregáveis

- Interface `TextGenerationProvider`.
- Interface `VoiceGenerationProvider`.
- Interface `ImageGenerationProvider`.
- Configuração de providers.
- Registro de provider usado.
- Registro de custo estimado.
- Fallback manual.

## User stories

### US-071 — Gerar texto com provider configurado

Como sistema, quero usar um provider configurado para gerar ideias e roteiros.

### US-072 — Trocar provider de voz

Como usuário, quero trocar o provider de narração sem reescrever a aplicação.

### US-073 — Registrar custo

Como usuário, quero saber o custo estimado de cada geração.

## Critérios de aceite

- Providers são acessados por interface.
- Resultado registra provider.
- Troca de provider não altera domínio principal.
- Falhas de provider são registradas.

---

# EPIC 24 — Content Factory em lote

## Objetivo

Permitir gerar múltiplos projetos de conteúdo a partir de uma marca, formato e período.

## Prioridade

**P2 — Pós-MVP inicial**

## Descrição

A Content Factory em lote será uma das features principais da plataforma, permitindo criar calendários semanais de conteúdo.

## Entregáveis

- Escolher marca.
- Escolher formato.
- Definir quantidade de vídeos.
- Definir período.
- Gerar calendário.
- Criar múltiplos projetos.
- Aprovar em lote.
- Enviar para produção em lote.

## User stories

### US-074 — Gerar calendário semanal

Como usuário, quero gerar uma semana de ideias para uma marca.

### US-075 — Criar múltiplos projetos

Como usuário, quero transformar ideias aprovadas em vários projetos.

### US-076 — Aprovar em lote

Como usuário, quero aprovar vários conteúdos de uma vez.

## Critérios de aceite

- Sistema gera múltiplas ideias.
- Usuário pode aprovar ideias antes de criar projetos.
- Projetos são criados com status correto.
- Produção em lote respeita limites e filas.

---

# EPIC 25 — Preparação para múltiplas plataformas

## Objetivo

Garantir que o core esteja pronto para TikTok, Instagram, Kwai e outras plataformas.

## Prioridade

**P1 — Arquitetural, mesmo sem implementação completa**

## Descrição

Mesmo que o MVP publique apenas no YouTube, o sistema deve ter abstrações de plataforma desde o começo.

## Entregáveis

- Enum genérico de plataformas.
- Interface `PlatformPublisher`.
- Validações por plataforma.
- `platform_metadata_json`.
- `scheduling_mode`.
- `content_format`.
- Estrutura de pastas para adapters futuros.
- Documentação de como adicionar nova plataforma.

## User stories

### US-077 — Adicionar nova plataforma no futuro

Como desenvolvedor, quero adicionar TikTok ou Instagram sem refatorar o core.

### US-078 — Validar regras por plataforma

Como sistema, quero aplicar regras diferentes para cada destino de publicação.

## Critérios de aceite

- Core não depende diretamente do YouTube.
- YouTube é apenas um adapter.
- Publicações usam `platform_publications`.
- Estrutura suporta novas plataformas.

---

# EPIC 26 — Analytics básico pós-publicação

## Objetivo

Importar e exibir métricas básicas dos vídeos publicados no YouTube.

## Prioridade

**P2 — Pós-MVP**

## Descrição

Após publicação, o sistema poderá acompanhar performance para alimentar decisões futuras de conteúdo.

## Entregáveis

- Buscar métricas do vídeo.
- Views.
- Likes.
- Comentários.
- Status de publicação.
- Histórico de métricas.
- Tela de performance por marca.
- Performance por formato.

## User stories

### US-079 — Ver métricas do vídeo

Como usuário, quero ver views, likes e comentários dos vídeos publicados.

### US-080 — Comparar formatos

Como usuário, quero comparar Shorts e vídeos longos.

### US-081 — Identificar melhores temas

Como usuário, quero entender quais temas performam melhor.

## Critérios de aceite

- Sistema importa métricas básicas.
- Métricas são vinculadas à publicação.
- Usuário consegue filtrar por marca.
- Métricas podem ser usadas futuramente para recomendar ideias.

---

# EPIC 27 — SaaS readiness

## Objetivo

Preparar a aplicação para evolução futura como SaaS.

## Prioridade

**P3 — Futuro**

## Descrição

Não faz parte do MVP, mas algumas decisões devem ser previstas para evitar reescrita.

## Entregáveis futuros

- Workspaces.
- Times.
- Permissões.
- Billing.
- Limites por plano.
- Convites.
- Auditoria por usuário.
- Templates compartilhados.
- Quotas por plano.
- Multi-tenant seguro.

## User stories

### US-082 — Criar workspace

Como usuário futuro, quero criar um workspace para organizar canais e equipe.

### US-083 — Convidar membros

Como dono do workspace, quero convidar pessoas para colaborar.

### US-084 — Definir permissões

Como dono do workspace, quero controlar quem pode publicar.

## Critérios de aceite futuros

- Dados isolados por workspace.
- Permissões aplicadas.
- Billing integrado.
- Limites de uso respeitados.

---

# Ordem recomendada de implementação

## Release 0 — Fundação

1. EPIC 01 — Fundação técnica.
2. EPIC 02 — Autenticação e usuário.
3. EPIC 03 — Gestão de canais internos.
4. EPIC 04 — Perfis de distribuição.

## Release 1 — Core de conteúdo

5. EPIC 07 — Projetos de conteúdo.
6. EPIC 08 — Geração de ideias com IA.
7. EPIC 09 — Geração e versionamento de roteiros.
8. EPIC 21 — Logs, auditoria e observabilidade.

## Release 2 — Produção de mídia

9. EPIC 11 — Geração de narração.
10. EPIC 12 — Geração de assets visuais e thumbnail.
11. EPIC 13 — Legendas e arquivos auxiliares.
12. EPIC 22 — Storage de arquivos.

## Release 3 — Renderização

13. EPIC 14 — Renderização de vídeo.
14. EPIC 15 — Orquestração da Content Factory com Inngest.

## Release 4 — YouTube

15. EPIC 05 — Integração com contas de plataforma.
16. EPIC 06 — OAuth e conexão com YouTube.
17. EPIC 16 — Planos de publicação.
18. EPIC 17 — YouTube Publisher Adapter.
19. EPIC 18 — Revisão humana e checklist de publicação.

## Release 5 — Qualidade operacional

20. EPIC 19 — Originalidade, qualidade e policy checks.
21. EPIC 20 — Agenda editorial.

## Pós-MVP

22. EPIC 10 — Vídeos de referência e fórmulas criativas.
23. EPIC 23 — Configuração de providers de IA.
24. EPIC 24 — Content Factory em lote.
25. EPIC 25 — Preparação para múltiplas plataformas.
26. EPIC 26 — Analytics básico pós-publicação.
27. EPIC 27 — SaaS readiness.

---

# MVP mínimo validável

Para validar a primeira versão funcional, os épicos realmente obrigatórios são:

```text
EPIC 01 — Fundação técnica
EPIC 02 — Autenticação e usuário
EPIC 03 — Gestão de canais internos
EPIC 04 — Perfis de distribuição
EPIC 05 — Integração com contas de plataforma
EPIC 06 — OAuth e conexão com YouTube
EPIC 07 — Projetos de conteúdo
EPIC 08 — Geração de ideias com IA
EPIC 09 — Geração e versionamento de roteiros
EPIC 11 — Geração de narração
EPIC 12 — Geração de assets visuais e thumbnail
EPIC 14 — Renderização de vídeo
EPIC 15 — Orquestração com Inngest
EPIC 16 — Planos de publicação
EPIC 17 — YouTube Publisher Adapter
EPIC 18 — Revisão humana
EPIC 21 — Logs e observabilidade
EPIC 22 — Storage de arquivos
```

Com esses épicos, o sistema já consegue cumprir o fluxo principal:

```text
Criar marca
→ Gerar roteiro
→ Gerar narração
→ Gerar assets
→ Renderizar vídeo
→ Revisar
→ Upload privado no YouTube
→ Agendar publicação
```
