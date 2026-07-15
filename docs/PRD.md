# PRD — Plataforma de Automação de Conteúdo para Canais Dark/Faceless com IA

## 1. Nome provisório

**Creator Factory AI**

Outras opções futuras:

- Dark Channel Factory
- Faceless Content OS
- Viral Formula Studio
- Content Factory AI
- AutoCreator Lab

---

## 2. Resumo executivo

A plataforma será uma aplicação pessoal, inicialmente focada em **YouTube**, para criação automatizada de conteúdos de canais dark/faceless com IA. O sistema permitirá criar marcas, gerar ideias, roteiros, narrações, assets visuais, vídeos finais em formato **Shorts** ou **vídeos longos**, gerar metadados de publicação e agendar postagem em canais do YouTube.

Embora o MVP seja exclusivo para YouTube, a arquitetura deve nascer preparada para integrações futuras com outras plataformas, como TikTok, Instagram Reels, Kwai e Facebook Reels. O YouTube será tratado como o **primeiro adapter de distribuição**, não como o centro do domínio.

A plataforma também poderá analisar vídeos de referência para extrair fórmulas criativas, mas com foco em gerar **conteúdos originais**, evitando cópia direta, conteúdo repetitivo, reaproveitamento indevido ou violação de políticas de monetização.

---

## 3. Objetivo do produto

Criar uma plataforma pessoal que funcione como uma **fábrica de conteúdo com IA** para canais dark/faceless.

O sistema deve permitir que o usuário:

1. Cadastre marcas de conteúdo.
2. Defina nicho, idioma, formato e frequência.
3. Gere ideias de vídeos.
4. Gere roteiros completos.
5. Gere narração com IA.
6. Gere imagens, cenas, B-rolls ou prompts visuais.
7. Renderize vídeos automaticamente.
8. Gere thumbnail, título, descrição e tags.
9. Revise o conteúdo antes da publicação.
10. Publique ou agende vídeos no YouTube.
11. Futuramente, publique em outras plataformas usando adapters.

---

## 4. Escopo do MVP

### 4.1 Dentro do MVP

O MVP deve suportar:

- YouTube como única plataforma de publicação.
- Dois formatos iniciais:
  - YouTube Shorts.
  - YouTube Long Form.

- Cadastro de marcas.
- Conexão com conta/canal do YouTube via OAuth.
- Criação de projetos de conteúdo.
- Geração de ideias com IA.
- Geração de roteiro com IA.
- Geração de metadados:
  - título;
  - descrição;
  - tags;
  - thumbnail prompt;
  - disclosure de uso de IA quando aplicável.

- Geração de narração.
- Geração de assets visuais ou prompts visuais.
- Renderização de vídeo final com FFmpeg.
- Upload privado para YouTube.
- Agendamento de publicação no YouTube.
- Acompanhamento de status da publicação.
- Revisão humana obrigatória antes de publicar/agendar.
- Histórico de jobs, erros e reprocessamentos.

### 4.2 Fora do MVP

Ficam fora da primeira versão:

- Publicação em TikTok.
- Publicação em Instagram Reels.
- Publicação em Kwai.
- SaaS multiusuário completo.
- Billing/assinaturas.
- Marketplace de templates.
- Analytics avançado de performance.
- Geração automática de centenas de vídeos sem revisão.
- Download automático de vídeos de terceiros.
- Clonagem de voz de pessoas reais sem autorização.
- Repostagem de vídeos de terceiros.
- Scraping de plataformas sem API oficial/autorização.

---

## 5. Princípio arquitetural principal

O sistema deve ser **YouTube-first**, mas **platform-agnostic**.

Regra central:

> O YouTube é o primeiro destino de publicação, não o centro do domínio.

Portanto, evitar nomes e estruturas presas ao YouTube no core da aplicação.

Evitar:

```text
youtube_videos
youtube_uploads
youtube_schedules
youtube_channels
```

Preferir:

```text
platform_accounts
platform_publications
publication_plans
brands
rendered_videos
distribution_profiles
content_project_targets
```

Campos específicos do YouTube devem ficar em `platform_metadata_json` ou em tabelas complementares específicas, caso necessário.

---

## 6. Personas

### 6.1 Usuário principal — Operador/Criador

Pessoa que quer criar e operar canais dark/faceless com apoio de IA.

Necessidades:

- Produzir vídeos em escala.
- Reduzir tempo de criação.
- Testar nichos.
- Gerar roteiros rapidamente.
- Automatizar narração e vídeo.
- Agendar publicações.
- Manter controle de qualidade.

### 6.2 Usuário futuro — Agência/Operador multi-canal

Possível usuário futuro caso vire SaaS.

Necessidades:

- Gerenciar várias marcas.
- Criar calendários editoriais.
- Produzir conteúdo em lote.
- Ter aprovação por etapas.
- Ver performance por marca.
- Gerenciar equipes.

---

## 7. Jornada principal do usuário

### 7.1 Fluxo principal

```text
1. Usuário cria uma marca
   ↓
2. Define nicho, idioma, estilo e formato
   ↓
3. Cria um projeto de conteúdo
   ↓
4. Escolhe formato: Shorts ou Long Form
   ↓
5. IA gera ideias
   ↓
6. Usuário escolhe ou aprova uma ideia
   ↓
7. IA gera roteiro
   ↓
8. IA gera narração
   ↓
9. IA gera plano de cenas/assets
   ↓
10. Sistema renderiza o vídeo
   ↓
11. IA gera título, descrição, tags e thumbnail
   ↓
12. Usuário revisa
   ↓
13. Sistema faz upload privado para YouTube
   ↓
14. Sistema agenda publicação
   ↓
15. Sistema acompanha status
```

---

## 8. Funcionalidades do MVP

## 8.1 Módulo de marcas

### Descrição

Permitir cadastrar marcas da plataforma. Uma marca representa uma linha editorial ou marca de conteúdo, não necessariamente uma conta de plataforma externa.

### Campos principais

```text
brands
- id
- user_id
- name
- niche
- language
- default_tone
- default_video_style
- status
- created_at
- updated_at
```

### Regras de negócio

- Um usuário pode ter várias marcas.
- Cada marca deve ter um nicho principal.
- Cada marca deve ter um idioma padrão.
- Cada marca pode ter múltiplos perfis de distribuição.
- Uma marca pode ser conectada a uma ou mais contas externas no futuro.
- No MVP, somente conexão com YouTube será implementada.

---

## 8.2 Módulo de contas de plataforma

### Descrição

Gerenciar contas externas conectadas, começando por YouTube.

### Campos principais

```text
platform_accounts
- id
- user_id
- platform
- external_account_id
- external_account_name
- access_token_encrypted
- refresh_token_encrypted
- token_expires_at
- scopes
- status
- created_at
- updated_at
```

### Plataformas previstas

```text
youtube
tiktok
instagram
kwai
facebook
```

### MVP

Somente:

```text
youtube
```

### Regras de negócio

- Tokens devem ser armazenados criptografados.
- O sistema deve registrar os escopos autorizados.
- Se o token expirar, o sistema deve tentar renovar usando refresh token.
- Se a renovação falhar, a conta deve mudar para `reauth_required`.
- O usuário precisa reconectar a conta caso a autorização seja revogada.
- O core do sistema não deve chamar diretamente a API do YouTube; deve usar o adapter `YouTubePublisher`.

---

## 8.3 Ligação entre marca e conta externa

### Descrição

Permitir associar uma marca a uma conta/canal externo.

### Campos principais

```text
brand_platform_accounts
- id
- brand_id
- platform_account_id
- platform
- external_channel_id
- is_default
- status
- created_at
- updated_at
```

### Regras de negócio

- No MVP, cada marca pode ter uma conta YouTube padrão.
- Futuramente, a mesma marca poderá publicar em YouTube, TikTok e Instagram.
- Uma marca pode ter apenas uma conta padrão por plataforma.
- Não permitir publicação em plataforma sem conta conectada.

---

## 8.4 Módulo de projetos de conteúdo

### Descrição

Um projeto de conteúdo representa o conteúdo-base em produção. Ele pode ser distribuído em um ou mais formatos sem duplicar roteiro, narração e assets.

### Campos principais

```text
content_projects
- id
- brand_id
- title
- topic
- niche
- language
- content_type
- content_goal
- status
- created_at
- updated_at
```

### Tipos de conteúdo

```text
educational_dark_video
curiosity_video
storytelling_video
top_list_video
news_explainer
affiliate_video
documentary_style
```

### Alvos de distribuição

Um projeto seleciona um ou mais perfis através de `content_project_targets`. O projeto não possui um único `content_format`.

```text
content_project_targets
- id
- content_project_id
- distribution_profile_id
- status
- config_snapshot_json
- created_at
- updated_at
```

### Status

```text
draft
idea_generated
script_generating
script_generated
assets_generating
assets_generated
rendering
rendered
ready_for_review
approved
ready_for_publication
failed
archived
```

### Regras de negócio

- Todo conteúdo deve pertencer a uma marca.
- Todo conteúdo deve ter pelo menos um alvo de distribuição.
- Cada alvo deve referenciar um perfil ativo pertencente à marca do projeto.
- A configuração do perfil deve ser copiada para `config_snapshot_json` no momento da seleção.
- O conteúdo não pode ser publicado sem vídeo renderizado.
- O conteúdo não pode ser publicado sem aprovação humana.
- O conteúdo pode ter múltiplas versões de roteiro.
- O conteúdo pode ter múltiplos vídeos renderizados para formatos diferentes.
- O conteúdo pode ser publicado em múltiplas plataformas no futuro.

---

## 8.5 Módulo de vídeos de referência

### Descrição

Permitir cadastrar vídeos de referência para análise criativa. O objetivo é extrair estrutura narrativa e padrões de retenção, não copiar conteúdo.

### Campos principais

```text
reference_videos
- id
- brand_id
- platform
- url
- external_video_id
- title
- channel_name
- transcript
- duration_seconds
- metrics_json
- analysis_json
- formula_json
- status
- created_at
- updated_at
```

### Regras de negócio

- O sistema pode aceitar link de vídeo de referência.
- O usuário pode colar transcrição manualmente.
- O sistema não deve baixar vídeos de terceiros sem autorização.
- O sistema não deve copiar roteiro, narração, cenas ou estrutura com similaridade excessiva.
- A análise deve gerar uma fórmula abstrata, não uma reprodução do vídeo.
- A fórmula extraída deve ser usada para gerar conteúdos originais.

---

## 8.6 Módulo de roteiros

### Descrição

Gerar e versionar roteiros.

### Campos principais

```text
scripts
- id
- content_project_id
- version
- hook
- body
- cta
- full_script
- estimated_duration_seconds
- tone
- status
- created_at
- updated_at
```

### Status

```text
draft
generated
approved
rejected
archived
```

### Regras de negócio

- Cada projeto pode ter múltiplas versões de roteiro.
- Apenas uma versão pode estar marcada como aprovada.
- A renderização deve usar a versão aprovada.
- O roteiro deve passar por validação de originalidade antes da aprovação.
- Conteúdos factuais devem incluir orientação de fontes ou verificação.

---

## 8.7 Módulo de assets de mídia

### Descrição

Gerenciar todos os arquivos e assets usados na produção.

### Campos principais

```text
media_assets
- id
- content_project_id
- type
- provider
- prompt
- file_url
- file_size
- mime_type
- metadata_json
- status
- created_at
- updated_at
```

### Tipos de asset

```text
voiceover
background_music
image
video_clip
subtitle_file
thumbnail
broll
sound_effect
```

### Regras de negócio

- Todo asset deve pertencer a um projeto.
- Assets gerados por IA devem guardar prompt e provider.
- Assets externos devem guardar fonte/licença quando aplicável.
- Não permitir assets sem origem identificável.
- Não usar voz clonada de pessoa real sem autorização explícita.
- Background music deve ser royalty-free, licenciada ou gerada com permissão de uso.

---

## 8.8 Módulo de renderização de vídeo

### Descrição

Renderizar vídeos finais a partir do roteiro, narração, imagens/clipes, legendas e trilha sonora.

### Campos principais

```text
rendered_videos
- id
- content_project_target_id
- platform
- content_format
- file_url
- duration_seconds
- aspect_ratio
- resolution
- file_size
- checksum
- status
- render_job_id
- created_at
- updated_at
```

### Status

```text
queued
rendering
rendered
failed
archived
```

### Regras de negócio

- Vídeos longos e Shorts devem ser renderizados a partir de alvos e snapshots de configuração diferentes.
- O vídeo final deve ser salvo em storage externo.
- O sistema deve registrar checksum para evitar duplicidade.
- Renderização deve rodar em worker/container, não dentro de request web.
- Falhas de renderização devem permitir retry.
- Um alvo de distribuição pode ter mais de um vídeo renderizado, por exemplo após reprocessamento ou nova versão.

---

## 8.9 Módulo de publicação

### Descrição

Controlar a intenção de publicar um vídeo renderizado.

### Campos principais

```text
publication_plans
- id
- content_project_id
- rendered_video_id
- brand_id
- status
- created_at
- updated_at
```

### Status

```text
draft
ready
approved
publishing
scheduled
published
failed
cancelled
```

### Regras de negócio

- Um plano de publicação deve estar associado a um vídeo renderizado.
- O plano só pode avançar para publicação se o projeto estiver aprovado.
- Um plano pode gerar múltiplas publicações específicas no futuro.
- No MVP, o plano terá apenas publicação YouTube.

---

## 8.10 Publicações por plataforma

### Descrição

Representar a publicação específica em uma plataforma externa.

### Campos principais

```text
platform_publications
- id
- publication_plan_id
- platform_account_id
- platform
- content_format
- external_publication_id
- title
- description
- tags_json
- thumbnail_url
- scheduled_at
- published_at
- privacy_status
- scheduling_mode
- upload_status
- processing_status
- platform_metadata_json
- error_message
- created_at
- updated_at
```

### Valores de `scheduling_mode`

```text
native
internal
manual
```

### Valores de `upload_status`

```text
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

### Valores de `processing_status`

```text
not_started
processing
processed
rejected
unknown
```

### Regras de negócio

- No MVP, `platform = youtube`.
- Para agendamento no YouTube, o vídeo deve ser enviado como privado e ter `publishAt` futuro.
- O sistema deve salvar o ID externo retornado pela plataforma.
- O sistema deve registrar erros de upload/agendamento.
- Toda publicação deve passar por validação específica da plataforma.
- A publicação não deve ocorrer sem revisão humana.

A API do YouTube permite upload via `videos.insert`, com suporte a envio de arquivo e metadados. A documentação também informa que uploads por projetos de API não verificados criados após 28 de julho de 2020 ficam restritos ao modo privado até auditoria de conformidade.

O recurso de vídeo do YouTube possui `status.publishAt`; quando usado para agendamento, o vídeo deve estar privado antes de ser publicado. A própria documentação descreve o efeito de `publishAt` e sua relação com `privacyStatus`.

---

## 9. Regras de negócio gerais

## 9.1 Regras de criação de conteúdo

1. Todo conteúdo deve pertencer a uma marca.
2. Todo conteúdo deve ter nicho, idioma e formato.
3. Todo conteúdo gerado por IA deve passar por revisão humana antes da publicação.
4. O sistema deve evitar geração massiva sem aprovação.
5. O sistema deve gerar conteúdo original, não cópias de vídeos de referência.
6. O sistema deve armazenar prompts, versões e resultados gerados.
7. Conteúdos factuais devem ter etapa de validação ou indicação de fontes.
8. Conteúdo sensível, como saúde, finanças, política e notícias, deve receber flag de risco maior.
9. Não permitir uso de voz clonada de pessoa real sem permissão.
10. Não permitir uso de imagem realista de pessoa pública sem avaliação de risco.
11. Não permitir publicação de conteúdo enganoso, difamatório ou que simule fatos reais de forma indevida.

---

## 9.2 Regras de originalidade

1. O sistema pode analisar fórmulas criativas.
2. O sistema não deve copiar roteiro de vídeo de referência.
3. O sistema não deve copiar título com baixa variação.
4. O sistema não deve reutilizar transcrição como base literal.
5. A IA deve extrair estruturas abstratas, como:
   - tipo de gancho;
   - progressão narrativa;
   - emoção dominante;
   - padrão de CTA;
   - formato de retenção.

6. O sistema deve gerar uma pontuação de similaridade textual.
7. Conteúdos com similaridade alta devem ser bloqueados ou exigir revisão.
8. O usuário deve poder regenerar roteiro com instrução de maior originalidade.

---

## 9.3 Regras de IA e disclosure

1. O sistema deve marcar internamente quando conteúdo usa IA.
2. Se o conteúdo for realista e alterado/sintético, deve ser marcado para disclosure no YouTube.
3. O campo `containsSyntheticMedia` deve ser considerado no adapter do YouTube.
4. O sistema deve gerar aviso interno quando o conteúdo representar:
   - pessoa real;
   - evento real;
   - local real;
   - cena realista;
   - notícia;
   - política;
   - saúde;
   - finanças.

## O YouTube exige que criadores divulguem conteúdo gerado ou alterado por IA quando ele parece realista. A documentação da API também inclui o campo `status.containsSyntheticMedia`, que pode ser definido em chamadas de insert/update de vídeos.

## 9.4 Regras de monetização e qualidade

1. O sistema deve evitar conteúdo repetitivo ou massificado.
2. O sistema deve incentivar comentário, curadoria, transformação ou valor original.
3. O sistema deve evitar “AI slop”.
4. O sistema deve registrar evidências de autoria:
   - roteiro próprio;
   - prompts;
   - assets;
   - narração;
   - datas de geração.

5. Conteúdos com baixa originalidade devem ser marcados como risco.
6. Conteúdos com baixa qualidade narrativa devem exigir revisão.

O YouTube atualizou sua política de monetização para esclarecer que conteúdo inautêntico, repetitivo ou massificado pode ser inelegível para monetização.

---

## 9.5 Regras de publicação

1. Nenhum vídeo deve ser publicado sem aprovação humana.
2. O upload inicial deve ser privado.
3. O agendamento deve usar `scheduling_mode = native` quando a plataforma suportar.
4. No YouTube, o agendamento deve usar vídeo privado + `publishAt`.
5. O sistema deve impedir agendamento no passado.
6. Se o horário escolhido estiver no passado, o sistema deve pedir nova data ou converter para publicação imediata apenas mediante aprovação.
7. O sistema deve salvar `external_publication_id`.
8. O sistema deve consultar status após upload.
9. O sistema deve registrar falhas de quota, autenticação e processamento.
10. O sistema deve permitir reprocessar publicação falhada.

---

## 9.6 Regras de quota e limites

1. O sistema deve registrar consumo de quota por plataforma.
2. O sistema deve bloquear jobs quando quota estiver próxima do limite.
3. Uploads devem ser rate-limited.
4. Reprocessamentos automáticos devem ter limite de tentativas.
5. Falhas por autenticação não devem gerar retry infinito.
6. Falhas por quota devem ser reagendadas.
7. Falhas temporárias devem usar retry com backoff.

A documentação da YouTube Data API usa sistema de quota, e há requisitos de auditoria para extensões de quota além do padrão.

---

## 10. Requisitos funcionais

## 10.1 Marcas

- RF-001: Criar marca.
- RF-002: Editar nicho, idioma e estilo da marca.
- RF-003: Arquivar marca.
- RF-004: Definir formato padrão da marca.
- RF-005: Definir frequência desejada de publicação.

## 10.2 Integração YouTube

- RF-006: Conectar conta Google/YouTube via OAuth.
- RF-007: Salvar tokens de forma criptografada.
- RF-008: Renovar tokens automaticamente.
- RF-009: Associar conta YouTube a marca.
- RF-010: Desconectar conta YouTube.
- RF-011: Validar permissões antes de upload.

## 10.3 Projetos de conteúdo

- RF-012: Criar projeto de conteúdo.
- RF-013: Escolher formato: Shorts ou Long Form.
- RF-014: Gerar ideia com IA.
- RF-015: Gerar roteiro com IA.
- RF-016: Versionar roteiro.
- RF-017: Aprovar roteiro.
- RF-018: Rejeitar roteiro.
- RF-019: Regenerar roteiro.

## 10.4 Geração de mídia

- RF-020: Gerar narração.
- RF-021: Gerar prompts de cenas.
- RF-022: Gerar ou importar imagens.
- RF-023: Gerar legenda.
- RF-024: Gerar thumbnail.
- RF-025: Salvar assets no storage.
- RF-026: Registrar provider e prompt usado.

## 10.5 Renderização

- RF-027: Criar job de renderização.
- RF-028: Renderizar vídeo com FFmpeg.
- RF-029: Gerar versão vertical para Shorts.
- RF-030: Gerar versão horizontal para vídeo longo.
- RF-031: Salvar MP4 final no storage.
- RF-032: Registrar duração, resolução e tamanho.
- RF-033: Permitir retry em caso de falha.

## 10.6 Publicação

- RF-034: Criar plano de publicação.
- RF-035: Gerar título.
- RF-036: Gerar descrição.
- RF-037: Gerar tags.
- RF-038: Definir thumbnail.
- RF-039: Validar publicação para YouTube.
- RF-040: Fazer upload privado.
- RF-041: Agendar publicação.
- RF-042: Consultar status.
- RF-043: Registrar ID externo.
- RF-044: Exibir link do vídeo após upload.
- RF-045: Marcar publicação como publicada.

## 10.7 Revisão e qualidade

- RF-046: Exibir checklist antes da publicação.
- RF-047: Marcar risco de conteúdo sintético.
- RF-048: Marcar risco de conteúdo repetitivo.
- RF-049: Exigir confirmação antes de publicar.
- RF-050: Guardar histórico de aprovação.

---

## 11. Requisitos não funcionais

## 11.1 Performance

- A aplicação web deve responder rapidamente em ações de dashboard.
- Jobs pesados devem rodar fora do ciclo de request.
- Renderização de vídeo não deve bloquear a aplicação.
- Upload para YouTube deve ser assíncrono.

## 11.2 Escalabilidade

- A arquitetura deve suportar múltiplos canais.
- A arquitetura deve suportar múltiplas plataformas futuras.
- A pipeline deve ser baseada em eventos.
- O sistema deve permitir workers separados para renderização.

## 11.3 Segurança

- Tokens OAuth devem ser criptografados.
- Variáveis sensíveis devem ficar fora do client.
- Arquivos privados devem usar URLs assinadas quando necessário.
- O sistema deve registrar logs de publicação e autenticação.
- O sistema deve ter controle de acesso por usuário.

## 11.4 Observabilidade

- Registrar eventos importantes.
- Registrar falhas de jobs.
- Registrar input/output resumido de IA.
- Registrar tempo de execução de cada etapa.
- Exibir logs úteis para depuração.

## 11.5 Manutenibilidade

- O core não deve conhecer detalhes de APIs externas.
- Integrações devem usar adapters.
- Schema deve ser versionado com migrations.
- Prompts devem ser versionados.
- Regras de plataforma devem ficar em configuração ou tabela.

---

## 12. Escolhas de tecnologia

## 12.1 Frontend e backend web

**Escolha:** TanStack Start.

### Motivo

TanStack Start é um framework full-stack React com SSR, streaming, server functions, server routes e builds client/server. Isso encaixa bem em um dashboard full-stack com formulários, rotas protegidas, endpoints internos, callback OAuth e endpoint de jobs.

A documentação também descreve Server Functions como lógica server-only chamável a partir de loaders, componentes, hooks ou outras server functions.

Server Routes são úteis para endpoints HTTP, autenticação, form submissions e callbacks, o que cobre casos como `/api/inngest` e callback do YouTube OAuth.

### Uso no projeto

- Dashboard.
- Páginas internas.
- Formulários.
- Server Functions.
- Server Routes.
- OAuth callback.
- API endpoint do Inngest.
- Controle de sessão.

### Risco

TanStack Start aparece na documentação atual como RC, então pode haver mudanças de API. Para mitigar, manter abstrações simples, evitar acoplamento excessivo e congelar versões no projeto.

---

## 12.2 Banco de dados

**Escolha:** PostgreSQL + Drizzle ORM.

### Motivo

O domínio do sistema é fortemente relacional: canais, contas, projetos, assets, scripts, vídeos, planos de publicação e publicações. Drizzle tem suporte nativo a PostgreSQL com drivers como `node-postgres` e `postgres.js`.

Drizzle Kit oferece fluxo de migrations com comandos como `generate`, `migrate`, `push`, `pull` e `export`, adequado para evolução incremental do schema.

### Uso no projeto

- Schema tipado.
- Migrations.
- Queries transacionais.
- Relacionamentos.
- Histórico de jobs.
- Registro de publicações.

---

## 12.3 Orquestração de jobs

**Escolha:** Inngest.

### Motivo

A aplicação precisa de workflows duráveis e assíncronos: gerar roteiro, gerar voz, gerar assets, renderizar vídeo, fazer upload e agendar. A documentação do Inngest para TanStack Start descreve uso para background tasks, workflows complexos e encadeamento de interações com LLMs.

O Inngest expõe funções por meio de um endpoint HTTP com `serve()`, recomendado em `/api/inngest` para facilitar deploys automatizados.

### Uso no projeto

- Pipeline de criação.
- Retries.
- Steps duráveis.
- Eventos de domínio.
- Geração assíncrona.
- Upload assíncrono.
- Agendamento interno quando necessário.

---

## 12.4 Storage

**Escolha recomendada:** Cloudflare R2 ou S3-compatible storage.

### Uso

- Áudios de narração.
- Imagens.
- Thumbnails.
- Legendas.
- Vídeos renderizados.
- Logs exportáveis.

### Regras

- Arquivos finais devem ter URL persistente.
- Arquivos privados devem usar assinatura temporária.
- Assets devem guardar metadata de origem.

---

## 12.5 Renderização

**Escolha:** FFmpeg em worker/container separado.

### Motivo

Renderização de vídeo é pesada, lenta e sujeita a falhas. Não deve rodar dentro da request web.

### Uso

- Compor cenas.
- Sincronizar narração.
- Adicionar legendas.
- Adicionar trilha.
- Exportar MP4.
- Gerar versões vertical/horizontal.

---

## 12.6 IA

### Componentes

- LLM para ideias, roteiros, metadados e análise.
- TTS para narração.
- Modelo de imagem ou banco de assets para cenas.
- Futuramente, modelo de vídeo generativo.

### Estratégia

Criar interfaces independentes de provider:

```text
TextGenerationProvider
VoiceGenerationProvider
ImageGenerationProvider
VideoGenerationProvider
```

Evitar acoplar o domínio a OpenAI, ElevenLabs, Google, Runway, Pika ou outro provider específico.

---

## 13. Arquitetura de alto nível

```text
TanStack Start App
   │
   ├── Dashboard
   ├── Server Functions
   ├── Server Routes
   ├── Auth
   ├── YouTube OAuth Callback
   └── /api/inngest
          │
          ▼
       Inngest
          │
          ├── Generate Ideas
          ├── Generate Script
          ├── Generate Voiceover
          ├── Generate Visual Assets
          ├── Render Video
          ├── Generate Metadata
          ├── Upload to YouTube
          ├── Schedule Publication
          └── Check Publication Status
          │
          ▼
PostgreSQL + Drizzle
          │
          ▼
Storage S3/R2
          │
          ▼
YouTube API
```

---

## 14. Pipeline de eventos

## 14.1 Eventos principais

```text
content.project.created
content.idea.requested
content.script.generated
content.script.approved
content.assets.requested
content.voiceover.generated
content.assets.generated
content.video.render.requested
content.video.rendered
publication.plan.created
publication.approved
publication.youtube.upload.requested
publication.youtube.uploaded
publication.youtube.scheduled
publication.youtube.published
publication.failed
```

## 14.2 Pipeline completo

```text
CreateContentProject
   ↓
GenerateIdeas
   ↓
GenerateScript
   ↓
WaitForScriptApproval
   ↓
GenerateVoiceover
   ↓
GenerateScenePlan
   ↓
GenerateVisualAssets
   ↓
RenderVideo
   ↓
GeneratePublicationMetadata
   ↓
WaitForHumanReview
   ↓
CreatePublicationPlan
   ↓
ValidateYouTubePublication
   ↓
UploadPrivateVideoToYouTube
   ↓
ScheduleYouTubePublication
   ↓
CheckYouTubeProcessingStatus
```

---

## 15. Adapter pattern para plataformas

## 15.1 Interface base

```ts
export interface PlatformPublisher {
  platform: 'youtube' | 'tiktok' | 'instagram' | 'kwai' | 'facebook'

  validate(input: ValidatePublicationInput): Promise<ValidationResult>

  upload(input: UploadPublicationInput): Promise<UploadPublicationResult>

  schedule(input: SchedulePublicationInput): Promise<SchedulePublicationResult>

  publishNow(input: PublishNowInput): Promise<PublishPublicationResult>

  getStatus(input: GetPublicationStatusInput): Promise<PublicationStatusResult>

  deletePublication?(input: DeletePublicationInput): Promise<void>
}
```

## 15.2 Implementação do MVP

```ts
export class YouTubePublisher implements PlatformPublisher {
  platform = 'youtube' as const

  async validate(input) {
    // valida título, descrição, formato, vídeo, thumbnail e disclosure
  }

  async upload(input) {
    // chama YouTube Data API videos.insert
  }

  async schedule(input) {
    // define privacyStatus private + publishAt
  }

  async publishNow(input) {
    // publica imediatamente mediante aprovação
  }

  async getStatus(input) {
    // consulta status do vídeo no YouTube
  }
}
```

## 15.3 Futuras implementações

```ts
export class TikTokPublisher implements PlatformPublisher {}
export class InstagramPublisher implements PlatformPublisher {}
export class KwaiPublisher implements PlatformPublisher {}
```

---

## 16. Estrutura de pastas sugerida

```text
src/
  db/
    schema/
      users.ts
      creator-channels.ts
      platform-accounts.ts
      content-projects.ts
      scripts.ts
      media-assets.ts
      rendered-videos.ts
      publications.ts
      audit-logs.ts
    index.ts

  modules/
    creator-channels/
      components/
      services/
      repositories/
      schemas/

    platform-accounts/
      services/
      repositories/
      schemas/

    content-projects/
      components/
      services/
      repositories/
      schemas/

    content-generation/
      prompts/
      services/
      providers/
      inngest-functions/

    media-assets/
      services/
      repositories/

    video-rendering/
      services/
      workers/
      inngest-functions/

    publications/
      services/
      repositories/
      schemas/
      inngest-functions/

    platform-integrations/
      core/
        platform-publisher.ts
        platform-types.ts
        platform-validation.ts

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

  routes/
    api/
      inngest.ts
      youtube/
        callback.ts
```

---

## 17. Modelo de dados inicial

## 17.1 `brands`

```text
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

## 17.2 `platform_accounts`

```text
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

## 17.3 `brand_platform_accounts`

```text
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

## 17.4 `distribution_profiles`

```text
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

Regras:

- `UNIQUE (brand_id, slug)`.
- `platform` representa o destino externo; `content_format` representa o formato.
- O perfil é um template e pode ser arquivado sem quebrar projetos existentes.
- `default_posting_times_json` deve conter dias, horário e timezone.

## 17.5 `content_projects`

```text
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

Um projeto não possui um único formato. Ele se relaciona a um ou mais alvos de distribuição.

## 17.6 `content_project_targets`

```text
id
content_project_id
distribution_profile_id
status
config_snapshot_json
created_at
updated_at
```

`config_snapshot_json` preserva a configuração efetivamente escolhida no projeto, mesmo que o perfil seja editado posteriormente.

## 17.7 `reference_videos`

```text
id
brand_id
platform
url
external_video_id
title
channel_name
transcript
duration_seconds
metrics_json
analysis_json
formula_json
status
created_at
updated_at
```

## 17.8 `scripts`

```text
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

## 17.9 `media_assets`

```text
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

## 17.10 `rendered_videos`

```text
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

## 17.11 `publication_plans`

```text
id
content_project_id
content_project_target_id
rendered_video_id
brand_id
status
created_at
updated_at
```

## 17.12 `platform_publications`

```text
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

## 17.13 `audit_logs`

```text
id
user_id
entity_type
entity_id
action
metadata_json
created_at
```

## 17.14 Diretrizes de Design e Modelagem de Dados

Para apoiar a publicação automatizada e multiplataforma de conteúdos de forma segura e performática, as seguintes diretrizes estruturais são adotadas na modelagem física do banco de dados:

1. **Desnormalização de `brand_id`:** O `brand_id` (identificador da marca) está presente de forma desnormalizada e redundante em tabelas como `publication_plans` e `distribution_profiles`. Isso serve para otimizar queries e filtros de performance da Agenda Editorial (calendário de postagens) por Marca na interface, evitando JOINs custosos.
2. **Reaproveitamento Multiformato:** A relação entre `content_projects`, `content_project_targets` e `rendered_videos` permite que um único projeto de conteúdo (mesmo roteiro, narração e assets) tenha múltiplos alvos e vídeos renderizados em diferentes proporções e resoluções (ex: 9:16 para Shorts e 16:9 para vídeos longos), permitindo o reaproveitamento nativo de assets de geração por IA.
3. **Segurança de Tokens:** Os tokens de plataformas em `platform_accounts` devem ser armazenados criptografados usando criptografia simétrica AES-256 baseada em uma chave secreta fornecida via variável de ambiente (`ENCRYPTION_KEY`).
4. **Mapeamento Flexível de Canal/Conta:** A tabela de associação `brand_platform_accounts` permite vincular a Marca a um destino de publicação (`external_channel_id` específico) utilizando uma conta autenticada (`platform_account_id`), suportando cenários em que uma única credencial gerencia múltiplos canais.

---

## 18. Telas do MVP

## 18.1 Dashboard

Mostrar:

- canais cadastrados;
- projetos em andamento;
- vídeos aguardando revisão;
- vídeos renderizando;
- publicações agendadas;
- falhas recentes.

## 18.2 Marcas

Funcionalidades:

- criar marca;
- editar nicho;
- configurar idioma;
- configurar estilo;
- conectar YouTube;
- definir perfil Shorts;
- definir perfil Long Form.

## 18.3 Content Factory

Tela central do sistema.

Campos:

- marca;
- formato;
- nicho;
- quantidade de vídeos;
- objetivo;
- tom;
- duração aproximada;
- fórmula criativa opcional;
- data inicial;
- frequência.

Ações:

- gerar ideias;
- gerar roteiros;
- aprovar em lote;
- iniciar produção;
- criar calendário.

## 18.4 Projeto de conteúdo

Mostrar:

- ideia;
- roteiro;
- assets;
- narração;
- vídeo renderizado;
- metadados;
- checklist de publicação;
- botão de aprovação.

## 18.5 Publicação

Mostrar:

- título;
- descrição;
- tags;
- thumbnail;
- canal YouTube;
- data/hora;
- status de upload;
- status de processamento;
- link externo.

## 18.6 Logs

Mostrar:

- jobs executados;
- erros;
- retries;
- tempo de execução;
- payload resumido;
- status por etapa.

---

## 19. Checklist de revisão antes de publicar

Antes de aprovar uma publicação, o sistema deve exibir:

```text
[ ] O roteiro está original?
[ ] O conteúdo não copia diretamente outro vídeo?
[ ] O vídeo tem valor próprio?
[ ] O título não é enganoso?
[ ] A descrição está coerente?
[ ] As tags estão adequadas?
[ ] O conteúdo usa IA realista?
[ ] Precisa marcar containsSyntheticMedia?
[ ] Há risco de conteúdo sensível?
[ ] A narração está correta?
[ ] O vídeo foi renderizado sem erro?
[ ] A thumbnail está adequada?
[ ] O horário de agendamento está correto?
```

---

## 20. Estratégia de MVP

## Fase 1 — Core

Objetivo: criar a base da aplicação.

Entregas:

- setup TanStack Start;
- setup Drizzle + PostgreSQL;
- autenticação;
- cadastro de canais;
- cadastro de projetos;
- schema inicial;
- tela de dashboard.

## Fase 2 — Geração de conteúdo

Objetivo: gerar ideias e roteiros.

Entregas:

- prompts versionados;
- geração de ideias;
- geração de roteiros;
- versionamento de roteiro;
- aprovação/rejeição.

## Fase 3 — Geração de mídia

Objetivo: produzir assets.

Entregas:

- geração de narração;
- geração de prompts visuais;
- upload/importação de assets;
- geração de legendas;
- geração de thumbnail.

## Fase 4 — Renderização

Objetivo: gerar MP4 final.

Entregas:

- worker FFmpeg;
- perfil Shorts;
- perfil Long Form;
- upload para storage;
- status de renderização;
- retry de falhas.

## Fase 5 — YouTube

Objetivo: publicar/agendar.

Entregas:

- OAuth YouTube;
- YouTube adapter;
- validação de metadados;
- upload privado;
- agendamento;
- consulta de status;
- logs de publicação.

---

## 21. Critérios de sucesso do MVP

O MVP será considerado funcional quando o usuário conseguir:

1. Criar uma marca.
2. Conectar um canal do YouTube.
3. Criar um projeto de conteúdo.
4. Gerar um roteiro com IA.
5. Gerar narração.
6. Renderizar um vídeo curto ou longo.
7. Revisar o vídeo.
8. Fazer upload privado no YouTube.
9. Agendar a publicação.
10. Ver status e link do vídeo.

---

## 22. Métricas internas

Mesmo sendo pessoal, o sistema deve registrar:

- tempo médio para gerar roteiro;
- tempo médio para gerar narração;
- tempo médio para renderizar vídeo;
- taxa de falha por etapa;
- número de vídeos criados por marca;
- número de vídeos publicados;
- número de vídeos reprocessados;
- custo estimado por vídeo;
- provider usado em cada etapa;
- taxa de aprovação de roteiros;
- taxa de aprovação de vídeos renderizados.

---

## 23. Riscos

## 23.1 Risco técnico

Renderização de vídeo pode ser pesada.

Mitigação:

- usar worker separado;
- usar FFmpeg fora do request web;
- limitar duração inicial;
- processar por fila.

## 23.2 Risco de API

YouTube pode limitar uploads, quota ou exigir auditoria.

Mitigação:

- começar com uso pessoal;
- upload privado;
- guardar logs;
- implementar rate limit;
- preparar processo de auditoria se virar produto público.

## 23.3 Risco de monetização

Conteúdo gerado em massa pode ser classificado como inautêntico/repetitivo.

Mitigação:

- revisão humana;
- score de originalidade;
- templates com valor agregado;
- evitar cópia;
- manter fontes;
- melhorar qualidade narrativa.

## 23.4 Risco legal/autoral

Uso indevido de vídeos, vozes, imagens ou músicas.

Mitigação:

- não baixar vídeos de terceiros sem autorização;
- não clonar vozes sem permissão;
- registrar origem dos assets;
- usar assets licenciados ou gerados;
- evitar reprodução direta de conteúdo.

## 23.5 Risco de qualidade

IA pode gerar conteúdo falso, genérico ou ruim.

Mitigação:

- prompts versionados;
- revisão obrigatória;
- validação factual;
- checklist antes de publicação;
- histórico de versões.

---

## 24. Roadmap futuro

## Pós-MVP 1 — Analytics

- importar métricas do YouTube;
- views;
- CTR;
- retenção;
- likes;
- comentários;
- inscritos gerados;
- comparação por fórmula.

## Pós-MVP 2 — Biblioteca de fórmulas

- salvar fórmulas criativas;
- reutilizar estruturas;
- comparar fórmulas;
- descobrir padrões vencedores.

## Pós-MVP 3 — Multi-plataforma

- TikTok adapter;
- Instagram Reels adapter;
- Kwai adapter;
- regras específicas por plataforma;
- calendário multi-plataforma.

## Pós-MVP 4 — Produção em lote

- gerar calendário semanal;
- gerar múltiplos vídeos;
- aprovação em lote;
- renderização em lote;
- publicação em lote.

## Pós-MVP 5 — SaaS

- multiusuário;
- times;
- billing;
- limites por plano;
- workspaces;
- templates compartilhados;
- permissões;
- auditoria por usuário.

---

## 25. Decisão técnica final

Stack recomendada:

```text
Aplicação full-stack:
TanStack Start

Banco de dados:
PostgreSQL

ORM:
Drizzle ORM

Migrations:
Drizzle Kit

Jobs/workflows:
Inngest

Renderização:
FFmpeg em worker/container

Storage:
Cloudflare R2 ou S3-compatible storage

Integração inicial:
YouTube Data API

Autenticação:
Better Auth ou solução equivalente

IA:
Providers desacoplados por interface

Arquitetura de plataformas:
Adapter Pattern
```

Resumo da decisão:

> TanStack Start cuida da aplicação, Drizzle cuida da persistência, Inngest cuida da fábrica de conteúdo, FFmpeg cuida da renderização e os adapters cuidam das plataformas externas.

---

## 26. Frase guia do produto

> Uma fábrica de conteúdo com IA para canais dark/faceless, começando pelo YouTube, mas preparada para distribuir conteúdo em múltiplas plataformas no futuro.

---

## 27. Frase guia da arquitetura

> O conteúdo é o centro do domínio; plataformas são apenas destinos de distribuição.
