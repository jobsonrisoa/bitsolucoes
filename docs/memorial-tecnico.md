# Memorial Técnico de Desenvolvimento

**Projeto**: Átrio - Portal Interno de Solicitações  

---

## 1. Tecnologias Utilizadas

### 1.1 Linguagens e Frameworks

#### TypeScript 5.6.2

- Linguagem principal para frontend e backend
- Tipagem estática para redução de erros em tempo de desenvolvimento
- Autocompletar avançado e refatoração segura

#### Frontend

- **Next.js 16.3.8**: Framework React com App Router para renderização server-side e rotas baseadas em sistema de arquivos
- **React 18.3.1**: Biblioteca UI para construção de interfaces componentes
- **Tailwind CSS 3.4.13**: Framework CSS utility-first para estilização rápida e consistente
- **GSAP 3.14.0**: Biblioteca de animações de alta performance para motion design
- **react-hook-form 7.53.0**: Gerenciamento de formulários com validação eficiente
- **zod 3.23.8**: Validação de schemas TypeScript-first
- **lucide-react 0.447.0**: Biblioteca de ícones consistentes e acessíveis

#### Backend

- **NestJS 11.2.7**: Framework Node.js com arquitetura modular baseado em Express
- **Prisma ORM 5.7.0**: ORM type-safe para PostgreSQL com migrations automáticas
- **bcrypt 6.0.0**: Hashing de senhas com rounds configuráveis
- **@nestjs/jwt 11.0.2**: Geração e verificação de tokens JWT
- **passport-jwt 4.0.1**: Estratégia Passport para autenticação JWT
- **ioredis 5.3.2**: Cliente Redis para cache-aside pattern
- **nestjs-pino 4.6.1**: Logging estruturado JSON com Pino

### 1.2 Banco de Dados e Cache

#### PostgreSQL 16

- Banco de dados relacional com extensão pg_trgm para busca de texto fuzzy
- Transações ACID para consistência de dados
- Índices otimizados para filtros frequentes (status, categoria, created_at)
- Dois databases no mesmo servidor Docker:
  - `atrio` (`DATABASE_URL`): desenvolvimento, seed de demo e E2E HTTP
  - `atrio_test` (`DATABASE_URL_TEST`): testes de integração isolados (schema sem seed)

#### Redis 7

- Cache em memória com pattern cache-aside
- TTL configurável para invalidação automática
- Suporte a operações atômicas para controle de versão de cache

### 1.3 API Gateway

#### Kong 3.6

- Gateway API em modo DB-less para simplicidade de deploy
- Plugins: JWT auth, rate limiting, CORS, correlation-id, file-log
- Centralização de preocupações cross-cutting (autenticação, logging)

### 1.4 Testes

#### Unitários e Integração

- **Jest 30.5.2**: Framework de testes para backend
- **Vitest 2.1.9**: Runner de testes para frontend com suporte a ESM
- **Supertest 7.3.1**: HTTP assertions para testes de API
- **Prisma Client**: Acesso direto ao banco de dados para testes de integração

#### E2E

- **Playwright 1.63.0**: Testes end-to-end do frontend (projeto Chromium)
- Instalação do browser (obrigatória após `npm install`):
  - `npm run playwright:install`
  - ou `npx --workspace=apps/frontend playwright install chromium`
  - Em CI/Linux sem libs de SO: `npx --workspace=apps/frontend playwright install --with-deps chromium`
- O `npm run setup` já executa a instalação do Chromium automaticamente

#### Load Testing

- **k6**: Ferramenta de teste de carga com scripting em JavaScript

#### Estratégia de Testes

- **Unitários**: Testes isolados de use cases, entidades e componentes (Jest/Vitest)
- **Integração**: Jest + Prisma contra `atrio_test` (`DATABASE_URL_TEST`), com cleanup de usuários `testuser*`
- **E2E Backend**: Supertest via Kong no banco `atrio` (seed `ana`/`carlos`)
- **E2E Frontend**: Playwright Chromium contra a UI em `:3000`
- **Isolamento**: banco de teste dedicado + usernames únicos por caso de integração

### 1.5 Containerização e Qualidade

#### Docker & Docker Compose

- Multi-stage builds para imagens otimizadas
- Health checks para todos os serviços
- Named volumes para persistência de dados
- Init scripts em `database/`: schema + seed em `atrio`, `init-test-db.sh` cria `atrio_test`
- Volumes já existentes: `npm run db:test:setup` garante o banco de teste sem recrear o volume

#### Qualidade de Código

- **TypeScript (`tsc --noEmit`)**: verificação estática via `npm run lint` / `npm run type-check`
- **Prettier**: Formatação de código consistente (backend)
- **@commitlint/cli**: Validação de mensagens de commit (Conventional Commits)
- **Playwright browsers**: Chromium instalado via `npm run playwright:install` (incluído no `npm run setup`)

---

## 2. Justificativa Técnica

### 2.1 TypeScript

**Motivo da escolha**: TypeScript adiciona tipagem estática ao JavaScript, capturando erros em tempo de compilação antes do runtime.

**Benefícios para o cenário proposto**:

- Autocompletar inteligente no IDE aumenta produtividade
- Refatoração segura em código base em crescimento
- Contratos de API claramente definidos através de interfaces
- Documentação embutida no código através de tipos

**Vantagens em relação a alternativas**:

- Comparado a JavaScript puro: reduz bugs relacionados a tipos, melhor manutenção em equipe
- Comparado a linguagens fortemente tipadas (Java, C#): mantém a flexibilidade dinâmica de JavaScript com benefícios de tipagem

**Impacto na manutenção, escalabilidade ou produtividade**:

- Manutenção: Refatorações mais seguras, menos regressões
- Escalabilidade: Código base pode crescer sem perda de clareza
- Produtividade: Autocompletar e navegação de código reduz tempo de desenvolvimento

### 2.2 Next.js com App Router

**Motivo da escolha**: Next.js oferece renderização server-side (SSR) e streaming, melhorando SEO e first contentful paint.

**Benefícios para o cenário proposto**:

- SEO melhorado para potencial exposição pública futura
- Carregamento inicial mais rápido com SSR
- Rotas baseadas em sistema de arquivos simplificam organização
- API routes integradas para proxy de requisições ao backend

**Vantagens em relação a alternativas**:

- Comparado a Create React App: SSR, otimizações automáticas, image optimization
- Comparado a Vite vanilla: convenções opinativas, ecossistema maduro, deploy simplificado

**Impacto na manutenção, escalabilidade ou produtividade**:

- Manutenção: Convenções claras reduzem decisões arquiteturais
- Escalabilidade: Code splitting automático, serverless-ready
- Produtividade: Menos configuração boilerplate, foco em features

### 2.3 NestJS

**Motivo da escolha**: NestJS fornece estrutura opinativa baseada em Angular para Node.js, com suporte nativo a TypeScript, injeção de dependências e modularização.

**Benefícios para o cenário proposto**:

- Arquitetura modular permite organização por domínio (auth, requests)
- Injeção de dependências facilita testes e substituição de implementações
- Suporte nativo a OpenAPI/Swagger reduz esforço de documentação
- Guards e Pipes reutilizáveis para validação e autorização

**Vantagens em relação a alternativas**:

- Comparado a Express puro: Estrutura organizada, menos código boilerplate, melhor escalabilidade
- Comparado a Fastify: Ecossistema mais maduro, mais recursos integrados

**Impacto na manutenção, escalabilidade ou produtividade**:

- Manutenção: Código organizado em módulos facilita localização de bugs
- Escalabilidade: Adição de novos módulos sem afetar existentes
- Produtividade: Geradores CLI, convenções testadas em produção

### 2.4 PostgreSQL com Prisma

**Motivo da escolha**: PostgreSQL é um banco de dados relacional maduro com suporte a JSON, extensões e performance comprovada. Prisma ORM oferece type-safe queries e migrations automáticas.

**Benefícios para o cenário proposto**:

- Relacionamentos entre users e requests enforced pelo banco
- Extensão pg_trgm para busca de texto fuzzy em títulos
- Migrations versionadas para controle de schema evolution
- Type-safe queries reduzem erros em queries SQL

**Vantagens em relação a alternativas**:

- Comparado a MySQL: Extensões mais poderosas (pg_trgm, JSONB), melhor conformidade com padrões SQL
- Comparado a MongoDB: Schema garantido pelo banco, transações ACID, melhor para dados relacionais
- Comparado a TypeORM: Prisma tem melhor DX, migrations mais confiáveis, performance superior

**Impacto na manutenção, escalabilidade ou produtividade**:

- Manutenção: Migrations versionadas facilitam rollback e evolução de schema
- Escalabilidade: PostgreSQL escala verticalmente e horizontalmente com replicas
- Produtividade: Prisma Client com autocompletar reduz erros em queries

### 2.5 Redis (Cache-Aside Pattern)

**Motivo da escolha**: Redis é um store chave-valor em memória com latência sub-milissegundo, ideal para cache de dados frequentemente acessados.

**Benefícios para o cenário proposto**:

- Dashboard summary cacheado reduz carga no PostgreSQL
- TTL automático evita dados stale
- Invalidação em escritas garante consistência eventual
- Fallback graceful quando Redis está indisponível

**Vantagens em relação a alternativas**:

- Comparado a cache em memória (memcached): Estruturas de dados mais ricas, persistência opcional
- Comparado a cache distribuído (Memcached): Cluster mode, replicação, persistência
- Comparado a cache no processo: Escalabilidade horizontal, compartilhamento entre instâncias

**Impacto na manutenção, escalabilidade ou produtividade**:

- Manutenção: Switch `CACHE_ENABLED=false` permite desabilitar cache para debug
- Escalabilidade: Redis cluster escala horizontalmente
- Produtividade: Cache-aside pattern simples de implementar e testar

### 2.6 Kong API Gateway

**Motivo da escolha**: Kong centraliza preocupações cross-cutting como autenticação, rate limiting e logging, evitando duplicação em cada serviço.

**Benefícios para o cenário proposto**:

- Autenticação JWT centralizada (único ponto de validação)
- Rate limiting protege backend de abusos
- Correlation ID propagado para traceabilidade em logs
- CORS configurado em um lugar apenas

**Vantagens em relação a alternativas**:

- Comparado a NGINX: Mais plugins, DB-less mode, ecossistema maior
- Comparado a ambassador/traefik: Mais maduro, plugins mais estáveis
- Comparado a implementação no backend: Separação de responsabilidades, configuração declarativa

**Impacto na manutenção, escalabilidade ou produtividade**:

- Manutenção: Configuração declarativa em YAML versionável
- Escalabilidade: Horizontal scaling sem alteração de configuração
- Produtividade: Plugins prontos reduzem código customizado

### 2.7 Clean Architecture Lite

**Motivo da escolha**: Separação clara de camadas (domain, application, infrastructure, presentation) facilita testes e evolução do código.

**Benefícios para o cenário proposto**:

- Domain layer com lógica de negócio independente de frameworks
- Application layer com use cases orquestrados e testáveis
- Infrastructure layer com implementações concretas (Prisma, Redis)
- Presentation layer com controllers e DTOs

**Vantagens em relação a alternativas**:

- Comparado a Clean Architecture estrita: Menos verbosidade, mais pragmático para escopo reduzido
- Comparado a arquitetura em camadas simples: Separação mais clara, melhor testabilidade
- Comparado a MVC tradicional: Use cases explícitos, domain layer puro

**Impacto na manutenção, escalabilidade ou produtividade**:

- Manutenção: Mudanças em uma camada não afetam outras
- Escalabilidade: Adição de novos use cases sem refatoração massiva
- Produtividade: Testes unitários focados em uma camada por vez

### 2.8 GSAP para Animações

**Motivo da escolha**: GSAP é a biblioteca de animações mais performante para web, com API declarativa e timeline orquestração.

**Benefícios para o cenário proposto**:

- Performance superior (60fps consistente) comparado a CSS puro
- Timeline orquestração para sequências complexas
- Reduzed motion support nativo
- Animações apenas em transform, opacity e clip-path (regra Átrio)

**Vantagens em relação a alternativas**:

- Comparado a Framer Motion: GSAP é mais leve, timeline mais poderosa
- Comparado a CSS puro: Orquestração complexa impossível em CSS
- Comparado a Anime.js: Performance superior, ecossistema maior

**Impacto na manutenção, escalabilidade ou produtividade**:

- Manutenção: Animações declarativas fáceis de ajustar
- Escalabilidade: Não impacta performance com muitas animações
- Produtividade: Timeline system reduz código de sequenciamento

---

## 3. Justificativa Conceitual

### 3.1 Estrutura Geral da Aplicação

A aplicação segue uma arquitetura de monolito modular organizada em três principais componentes:

1. **Frontend (Next.js)**: Roda na porta 3000, responsável pela interface do usuário e interação via browser
2. **Backend (NestJS)**: Roda na porta 3001, expõe API RESTful e contém lógica de negócio
3. **API Gateway (Kong)**: Roda na porta 8000, centraliza autenticação, rate limiting e logging

Esta arquitetura foi escolhida por ser:

- **Simples**: Menos complexidade que microserviços para um MVP
- **Escalável**: Cada componente pode ser escalado horizontalmente independentemente
- **Manutenível**: Separação clara de responsabilidades facilita debugging

### 3.2 Organização das Camadas

O backend segue Clean Architecture Lite com quatro camadas:

**Domain Layer** (`src/modules/*/domain/`)

- Entidades (Request, User)
- Value Objects (Status, Category)
- Ports (RequestRepository, PasswordHasher)
- Domain Errors
- Independente de frameworks e infraestrutura

**Application Layer** (`src/modules/*/application/`)

- Use Cases (CreateRequest, UpdateRequest, DeleteRequest, etc.)
- DTOs de entrada/saída
- Orquestra lógica de negócio
- Depend apenas do Domain Layer

**Infrastructure Layer** (`src/modules/*/infrastructure/`)

- Implementações concretas (PrismaRepository, BcryptPasswordHasher)
- Adapters externos (RedisCacheAdapter)
- Mappers (ORM ↔ Domain)
- Implementa ports do Domain Layer

**Presentation Layer** (`src/modules/*/presentation/`)

- Controllers (RequestsController, AuthController)
- DTOs de HTTP request/response
- Guards e Filters
- Exibe API endpoints

**Benefícios desta organização**:

- Testabilidade: Cada camada pode ser testada isoladamente
- Substituibilidade: Implementações de infraestrutura podem ser trocadas
- Evolução: Domain layer estável enquanto infrastructure evolui

### 3.3 Estratégia de Modelagem de Dados

**Modelagem Relacional**:

- Tabela `users`: id, username, name, password_hash, created_at
- Tabela `requests`: id, title, description, category, status, requester_id, created_at, updated_at
- Foreign key: requests.requester_id → users.id
- Índices: status, category, created_at DESC, title (pg_trgm GIN)

**Justificativa**:

- Modelo relacional escolhido por consistência e integridade referencial
- Índices otimizados para queries mais frequentes (listagem com filtros)
- pg_trgm para busca fuzzy em títulos (ILIKE com performance)
- ENUMs para status e category garantem validação no nível do banco

**Limitações admitidas**:

- Offset pagination (mais simples que cursor pagination)
- Sem soft delete (requests são excluídos permanentemente)
- Sem audit trail (histórico de modificações não persistido)

### 3.4 Padrões de Projeto Utilizados

#### Repository Pattern

- Abstrai acesso a dados em ports do Domain Layer
- Permite substituição de implementação (Prisma → TypeORM)
- Facilita testes com mocks

#### Decorator Pattern (Caching)

- `CachingRequestRepositoryDecorator` adiciona cache a repository base
- Segue Single Responsibility Principle
- Cache é transparente para use cases

#### Factory Pattern (Value Objects)

- Status e Category são value objects com métodos factory
- Garantem invariantes (ex: transições de status válidas)
- Imutabilidade previne bugs de estado compartilhado

#### Strategy Pattern (Password Hashing)

- `PasswordHasher` port permite diferentes implementações
- Bcrypt atual, mas poderia ser Argon2 no futuro
- Troca de estratégia sem afetar use cases

### 3.5 Estratégia de Autenticação

**JWT em HttpOnly Cookie**:

- Token JWT assinado com HS256
- Cookie httpOnly e SameSite protege contra XSS e CSRF
- Kong valida token, NestJS verifica novamente (defense in depth)
- Expiração: 8 horas

**Fluxo de autenticação**:

1. Usuário faz POST /auth/login com username e password
2. Backend valida com bcrypt, gera JWT
3. Kong seta cookie `session=JWT`
4. Requisições subsequentes incluem cookie automaticamente
5. Kong valida JWT, repassa para backend se válido
6. Backend extrai `sub` (user id) do JWT para contexto

**Justificativa**:

- HttpOnly cookie mais seguro que localStorage (proteção XSS)
- JWT stateless facilita scaling horizontal
- Kong centraliza validação, reduz código no backend
- Double verification (Kong + NestJS) para segurança

### 3.6 Estratégia de Comunicação Frontend-Backend

**RESTful API**:

- Recursos representados como URLs (/requests, /dashboard/summary)
- Métodos HTTP semânticos (GET, POST, PATCH, DELETE)
- Códigos de status HTTP apropriados (200, 201, 400, 401, 404, 409, 500)
- Paginação com query params (page, limit)

**Next.js API Rewrites**:

- Frontend roda em :3000, backend em :3001, Kong em :8000
- Next.js rewrites `/api/*` para Kong automaticamente
- Browser vê apenas origem :3000 (evita CORS)
- Kong é transparente para frontend

**Error Handling**:

- Errors DTOs padronizados (statusCode, code, message, errors, correlationId)
- Frontend exibe mensagens amigáveis baseadas em error codes
- Correlation ID propagado para traceabilidade

**Justificativa**:

- REST é padrão de fato, bem documentado e interoperável
- Rewrites simplificam configuração CORS no frontend
- Errors padronizados facilitam tratamento no frontend

### 3.7 Organização do Código-Fonte

**Monorepo com npm workspaces**:

- `apps/backend/`: Backend NestJS
- `apps/frontend/`: Frontend Next.js
- `k6/`: Scripts de load test
- `docs/`: Documentação técnica
- `database/`: Schema e seed SQL

**Convenções de nomenclatura**:

- Arquivos: kebab-case (auth.controller.ts)
- Classes: PascalCase (AuthController)
- Funções/variáveis: camelCase (getUserById)
- Constantes: UPPER_SNAKE_CASE (MAX_REQUESTS_PER_PAGE)

**Estrutura de módulos**:

- Cada módulo (auth, requests) é autocontido
- Módulos compartilham apenas código em `src/shared/`
- Imports relativos facilitam refatoração

**Justificativa**:

- Monorepo simplifica compartilhamento de código e configuração
- Workspaces npm facilitam dependências cross-app
- Convenções consistentes reduzem cognitive load

---

## 4. Análise Crítica

### 4.1 Limitações da Solução Implementada

#### Papel Único (Single Role)

- **Problema**: Todos os usuários autenticados têm as mesmas permissões
- **Impacto**: Qualquer usuário pode editar/excluir solicitações de outros
- **Justificativa**: Escopo do MVP não exigia RBAC, simplificou implementação
- **Risco**: Em produção, isso seria um problema de segurança

#### Paginação Offset

- **Problema**: Offset pagination tem performance degradante em páginas profundas
- **Impacto**: `OFFSET 10000` pode ser lento com muitos registros
- **Justificativa**: Cursor pagination mais complexo, offset suficiente para MVP
- **Risco**: Performance issue em tabelas com milhões de registros

#### Edição Global de Solicitações Abertas

- **Problema**: Qualquer usuário pode editar solicitações de outros enquanto estão abertas
- **Impacto**: Violação de ownership esperado em sistemas reais
- **Justificativa**: Simplificação de validação de permissões
- **Risco**: Usuários podem modificar solicitações de outros indevidamente

#### Sem Audit Trail

- **Problema**: Não há histórico de quem modificou o quê e quando
- **Impacto**: Impossível rastrear ações maliciosas ou erros
- **Justificativa**: Não estava nos requisitos do MVP
- **Risco**: Dificulta debugging e compliance em produção

#### Sem Notificações

- **Problema**: Usuários não são notificados sobre mudanças de status
- **Impacto**: Usuário precisa verificar manualmente atualizações
- **Justificativa**: Implementação de notificações complexa (email, in-app, WebSocket)
- **Risco**: UX degradada em sistemas com muitos usuários

#### Sem Validação de Email

- **Problema**: Email não é validado nem verificado
- **Impacto**: Usuários podem usar emails inválidos ou fictícios
- **Justificativa**: Seed data usa dados fictícios, validação não era requisito
- **Risco**: Problemas em comunicações futuras

### 4.2 Melhorias Futuras

#### Role-Based Access Control (RBAC)

- Adicionar campo `role` em users (ADMIN, USER)
- Administradores podem ver todas as solicitações
- Usuários comuns apenas suas próprias
- Requer mudança em todos os controllers para verificar ownership

#### Cursor Pagination

- Implementar cursor-based pagination usando created_at + id
- Performance constante independente da página
- Requer mudança em list-requests use case e DTOs

#### Audit Trail

- Tabela `request_history` com campos: request_id, old_values, new_values, changed_by, changed_at
- Trigger automático no PostgreSQL para logar mudanças
- Dashboard de auditoria para administradores

#### Sistema de Notificações

- Event bus (RabbitMQ ou Kafka) para publicar eventos
- Workers consomem eventos e enviam emails
- WebSocket para notificações em tempo real
- Preferências de notificação por usuário

#### Soft Delete

- Campo `deleted_at` em requests em vez de DELETE físico
- Requests "excluídos" podem ser restaurados
- Dashboard mostra ou oculta baseado em parâmetro

#### Validação de Email

- Envio de email de confirmação no registro
- Link de verificação com token temporário
- Bloqueio de funcionalidades até verificação

#### Internationalization (i18n)

- Suporte a múltiplos idiomas (pt-BR, en-US)
- biblioteca next-intl ou react-i18next
- Tradução de todos os textos da UI

### 4.3 Requisitos que Poderiam Ser Aperfeiçoados

#### Validação de Password Forte

- **Atual**: Apenas bcrypt hashing
- **Melhoria**: Requerer mínimo 8 caracteres, maiúscula, minúscula, número, símbolo
- **Implementação**: zod schema com regex customizado

#### Rate Limiting por Usuário

- **Atual**: Rate limiting global por IP
- **Melhoria**: Rate limiting por user_id após autenticação
- **Implementação**: Kong plugin com identificação por JWT claim

#### Retry em Falhas de Cache

- **Atual**: Fallback direto para banco
- **Melhoria**: Retry com exponential backoff antes de fallback
- **Implementação**: Redis adapter com retry logic

#### Circuit Breaker para Dependencies

- **Atual**: Sem circuit breaker, falhas propagam
- **Melhoria**: Circuit breaker para PostgreSQL e Redis
- **Implementação**: Biblioteca opossum ou resilience4j

#### API Versioning

- **Atual**: Versão única /api/v1
- **Melhoria**: Suporte a múltiplas versões (/api/v1, /api/v2)
- **Implementação**: NestJS versioning decorator

### 4.4 Decisões que Seriam Diferentes em Ambiente Corporativo de Produção

#### Infraestrutura como Código (IaC)

- **Atual**: Docker Compose para local/dev
- **Produção**: Terraform ou AWS CDK para provisionamento
- **Motivo**: Reprodutibilidade, versionamento de infra, rollbacks

#### CI/CD Robusto

- **Atual**: GitHub Actions básico
- **Produção**: Pipeline completo com testes, security scan, approval gates
- **Motivo**: Qualidade garantida antes de deploy, segurança

#### Monitoring e Observabilidade

- **Atual**: Logs estruturados apenas
- **Produção**: Prometheus + Grafana, Jaeger tracing, ELK stack
- **Motivo**: Visibility em produção, debugging em tempo real

#### Secrets Management

- **Atual**: Variáveis de ambiente em .env
- **Produção**: HashiCorp Vault ou AWS Secrets Manager
- **Motivo**: Segurança, rotação automática de secrets, audit trail

#### Database Backups

- **Atual**: Named volume local
- **Produção**: Backups automatizados, point-in-time recovery, multi-region
- **Motivo**: Recuperação de desastres, compliance, SLA

#### Autoscaling

- **Atual**: Instâncias fixas
- **Produção**: Horizontal Pod Autoscaler (K8s) ou AWS Auto Scaling
- **Motivo**: Cost optimization, handle traffic spikes

#### Blue-Green Deployments

- **Atual**: Deploy direto
- **Produção**: Blue-green ou canary deployments
- **Motivo**: Zero downtime, rollback instantâneo, testes em produção

#### Service Mesh

- **Atual**: Kong como único gateway
- **Produção**: Istio ou Linkerd para mTLS, traffic splitting, observabilidade
- **Motivo**: Security, resiliência, advanced traffic management

#### Event-Driven Architecture

- **Atual**: Síncrono, REST
- **Produção**: Event sourcing ou CQRS para escalabilidade eventual
- **Motivo**: Desacoplamento, scalability, audit trail nativo

#### Microservices

- **Atual**: Monolito modular
- **Produção**: Separação em microservices (auth, requests, notifications)
- **Motivo**: Independent scaling, fault isolation, team autonomy

#### Compliance e Security

- **Atual**: Básico (bcrypt, JWT, rate limiting)
- **Produção**: SOC2, GDPR compliance, SSO (SAML/OIDC), MFA
- **Motivo**: Requisitos legais, enterprise security standards

---

## 5. Conclusão

O projeto Átrio foi desenvolvido seguindo princípios de engenharia de software modernos, com foco em qualidade, testabilidade e manutenibilidade. A escolha de tecnologias priorizou:

- **Simplicidade**: Ferramentas maduras e bem documentadas
- **Performance**: Cache, índices otimizados, animações eficientes
- **Segurança**: Autenticação robusta, validação de inputs, logging estruturado
- **Escalabilidade**: Arquitetura modular, cache distribuído, separação de camadas

A solução atende aos requisitos funcionais do processo seletivo e fornece uma base sólida para evolução futura em ambiente corporativo. As limitações identificadas são conscientes e resultam de trade-offs deliberados para entrega no prazo de 5 dias, com caminho claro para melhoria em produção.

---

## Anexos

### A. Links Relevantes

- Repositório: [URL do GitHub]
- Documentação API: <http://localhost:3001/api/docs>
- Dashboard Kong: <http://localhost:8001>

### B. Comandos Úteis

```bash
# Setup completo (npm + .env + Playwright Chromium + Docker)
npm run setup

# Instalar apenas o browser do Playwright
npm run playwright:install

# Subir infraestrutura
npm run docker:up

# Garantir banco de integração atrio_test
npm run db:test:setup

# Executar testes
npm run test
npm run test:integration   # usa DATABASE_URL_TEST / atrio_test
npm run test:e2e

# Qualidade
npm run lint
npm run type-check
npm run build

# Popular banco atrio (reexecutar seed)
docker compose down -v && docker compose up -d

# Ver logs
npm run docker:logs
```

### C. Databases

| Database | Variável | Uso |
| --- | --- | --- |
| `atrio` | `DATABASE_URL` | App, seed, E2E HTTP |
| `atrio_test` | `DATABASE_URL_TEST` | Integração Jest/Prisma |

### D. Credenciais de Teste (seed em `atrio`)

- Usuário: ana / Senha: demo123 (ADMIN)
- Usuário: carlos / Senha: demo123 (USER)
