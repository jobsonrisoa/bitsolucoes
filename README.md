# Átrio - Portal Interno de Solicitações

Portal corporativo para gestão de solicitações internas (TI, RH, Compras, Financeiro e Infraestrutura).

---

## Arquitetura

O sistema adota monorepo npm workspaces estruturado em camadas e microserviços via Docker:

- **Frontend**: Next.js 16 (App Router), React 18, Tailwind CSS, GSAP. Executa na porta `3000`.
- **Backend**: NestJS 11 com Clean Architecture Lite, Prisma ORM, Pino Logger. Executa na porta interna `3001`.
- **API Gateway**: Kong Gateway 3.6 (DB-less mode) na porta `8000` (Admin na `8001`). Centraliza autenticação JWT por cookies, rate-limiting, CORS e correlação de logs.
- **Banco de Dados**: PostgreSQL 16 com extensão `pg_trgm` na porta `5432`.
  - `atrio` — banco de desenvolvimento/produção (com seed)
  - `atrio_test` — banco isolado para testes de integração (sem seed)
- **Cache**: Redis 7 com Cache-Aside pattern na porta `6379`.
- **Design System / Storybook**: Storybook 8 (React + Vite) na porta `6006` (`--profile dev`).

---

## Início Rápido

### Pré-requisitos

- Node.js >= 20
- Docker & Docker Compose
- Dependências de sistema do Playwright Chromium (instaladas automaticamente pelo comando abaixo em ambientes Linux/CI; em desktop, o `playwright install` baixa o browser)

### Setup Completo (Um Único Comando)

Execute o seguinte comando da raiz do projeto para instalar dependências, configurar ambiente, subir Docker e aguardar todos os serviços ficarem prontos:

```bash
npm run setup
```

Este comando executa automaticamente:

1. Instala todas as dependências npm
2. Copia arquivo `.env` (se não existir)
3. Instala o browser Chromium do Playwright (`npx playwright install chromium`)
4. Build e inicia todos os containers Docker
5. Cria/garante os bancos `atrio` e `atrio_test` (schema+seed em `atrio`, schema em `atrio_test`)
6. Aguarda todos os serviços ficarem prontos
7. Exibe URLs de acesso e credenciais de teste

### Setup Manual (Passo a Passo)

Se preferir executar manualmente:

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Instalar browser do Playwright (obrigatório para E2E do frontend)
npm run playwright:install
# equivalente: npx --workspace=apps/frontend playwright install chromium

# 4. Subir infraestrutura completa via Docker
docker compose up -d --build

# 5. Se o volume do Postgres já existia antes do atrio_test, criar o banco de teste:
npm run db:test:setup
```

### Executar Localmente (Modo Desenvolvimento)

Após o Docker estar rodando:

```bash
npm run dev
```

O comando executa concorrentemente:

- **Backend**: `http://localhost:3001`
- **Frontend**: `http://localhost:3000`

### Bancos de Dados

| Banco | URL (local) | Uso |
| --- | --- | --- |
| `atrio` | `postgresql://atrio:atrio@localhost:5432/atrio` (`DATABASE_URL`) | App, E2E HTTP e seed de demo |
| `atrio_test` | `postgresql://atrio:atrio@localhost:5432/atrio_test` (`DATABASE_URL_TEST`) | Testes de integração (Jest + Prisma) |

- Na primeira subida do Postgres, `database/schema.sql` e `database/seed.sql` inicializam `atrio`.
- `database/init-test-db.sh` cria `atrio_test` e aplica o mesmo schema **sem seed**.
- Volume já existente (sem `atrio_test`): `npm run db:test:setup`
- Reset completo (recria volumes + seed): `docker compose down -v && docker compose up -d`

O Prisma schema (`apps/backend/prisma/schema.prisma`) é usado para type-safe queries.

---

## Credenciais de Teste (Seed)

| Usuário | Senha | Função |
| --- | --- | --- |
| `ana` | `demo123` | ADMIN |
| `carlos` | `demo123` | USER |

Banco `atrio` inicializa com solicitações simuladas e índices trigram configurados. O banco `atrio_test` permanece vazio (dados criados e limpos pelos próprios testes).

---

## Comandos Principais

| Ação | Comando |
| --- | --- |
| Setup completo (install + Playwright + docker + migrações) | `npm run setup` |
| Instalar Chromium do Playwright | `npm run playwright:install` |
| Garantir banco `atrio_test` | `npm run db:test:setup` |
| Iniciar containers | `npm run docker:up` ou `docker compose up -d` |
| Parar containers | `npm run docker:down` ou `docker compose down` |
| Ver logs | `npm run docker:logs` ou `docker compose logs -f` |
| Build dos containers | `docker compose build` |
| Executar localmente | `npm run dev` |
| Storybook (Local) | `npm run storybook` |
| Storybook (Docker) | `npm run storybook:docker` |
| Testes unitários | `npm run test` |
| Testes de integração (usa `atrio_test`) | `npm run test:integration` |
| Testes E2E | `npm run test:e2e` |
| Teste de Carga (k6) | `make load` |
| Verificação de tipos | `npm run type-check` |
| Lint | `npm run lint` |
| Build (compilar) | `npm run build` |
| Reexecutar seed do banco | `docker compose down -v && docker compose up -d` |

---

## Testes

### Unitários

- Backend: Jest (`apps/backend`)
- Frontend: Vitest (`apps/frontend`)

### Integração (backend)

- Jest + Prisma contra `DATABASE_URL_TEST` (`atrio_test`)
- Cleanup automático de usuários `testuser*` entre casos
- Requer Postgres no ar: `npm run docker:up` (e `npm run db:test:setup` se necessário)

### E2E

- Backend: Jest + Supertest via Kong (`http://localhost:8000`)
- Frontend: Playwright (projeto Chromium)
  - Instalar browser: `npm run playwright:install`
  - Em CI/Linux sem deps de SO: `npx --workspace=apps/frontend playwright install --with-deps chromium`

---

## Healthchecks & Endpoints de Diagnóstico

- **Frontend Liveness**: `GET http://localhost:3000/api/health`
- **Backend Liveness**: `GET http://localhost:3001/api/v1/health/live`
- **Backend Readiness (PostgreSQL check)**: `GET http://localhost:3001/api/v1/health/ready`
- **Kong Gateway Proxy**: `GET http://localhost:8000/api/v1/health/live`
- **Swagger / OpenAPI**: `http://localhost:3001/api/docs`
- **Storybook UI**: `http://localhost:6006`
