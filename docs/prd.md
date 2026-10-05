# PRD v4: Átrio, Internal Requests Portal

Context: bit Soluções, Junior Systems Developer selection, 2nd stage (full stack mini-project)
Deadline: Monday, October 5, 2026
Status date: Friday, October 2, 2026 (3 days of work plus the deadline day remain)
Team: 1 developer
Voice: STE100 (short sentences, active voice, no contractions)
Normative annex: `docs/design-system.md` (Átrio Design System v1.2)

Guiding principle: simple core, production-ready edges, documentation before code. The domain is small. Clean Architecture and DDD are applied in their lightest useful form. Each extra tool has a written justification and a switch-off path.

---

## 0. Changes from v3

| Area | v3 | v4 |
| --- | --- | --- |
| Product and UI | shadcn with generic tokens | Átrio design system is normative: tokens, components, motion vocabulary, accessibility rules, anti-patterns |
| Animation library | Framer Motion | GSAP 3.14.0 (Átrio rule: animate only `transform`, `opacity`, `clip-path`) |
| Theme | Dark optional | Light and dark required |
| Logs | JSON logs, no schema | Documented log schema, event catalog, redaction rules, correlation id from Kong |
| API documentation | Swagger UI | Swagger UI, committed `openapi.yaml`, drift check in CI, error catalog, usage guide |
| Documentation | README and Memorial | Full docs-first suite, written and audited before development (section 6) |
| Schedule | 4 days | 3 days plus deadline day, with a minimum submission tier |
| Motion and icons | Pattern subset only | Full motion vocabulary with tiers and a one-gesture-per-screen budget. New icon vocabulary |

---

## 1. Executive Summary

**Problem Statement**: Employees have no single, traceable channel to register internal demands (IT, HR, Purchasing, Finance, Infrastructure) and follow them to completion.

**Proposed Solution**: Átrio is a web portal behind a Kong gateway. Authenticated users create, search, and track requests through three states (Aberto, Em Atendimento, Concluído). A dashboard shows totals. The backend is a modular monolith with clean layering, Redis caching, structured logs, and a documented API. The interface follows the Átrio design system.

**Success Criteria**:

- 100% of the functional requirements in the brief pass the BDD scenarios in section 2.
- `docker compose up` starts frontend, backend, Kong, PostgreSQL, and Redis from a clean clone with no manual change. Migrations and seed run automatically.
- Domain and application layers reach at least 90% unit coverage. Backend overall reaches at least 80%.
- Load test (k6, through Kong, 50 virtual users, 1 minute, 1,000 seeded requests): p95 under 300 ms and errors under 1%. Cached dashboard p95 under 100 ms.
- Lighthouse on login, list, and dashboard, in light and dark: Accessibility at least 95.
- 0 violations of the motion guard (forbidden properties, `transition: all`, more than one main gesture per screen). 100% of icon-only buttons have an accessible name. 100% of icons come from the icon registry.
- 100% of backend log lines validate against the log schema. 0 log lines contain a password, token, or cookie value.
- 100% of endpoints appear in Swagger and in the committed `openapi.yaml`, with examples and error responses.
- All documents in section 6 exist and pass the audit checklist before the first feature commit.
- 100% of commits follow Conventional Commits.

---

## 2. User Experience & Functionality

### Personas

**Employee (single role)**: any authenticated Brazilian employee of any area. The user is not technical. Everyone has the same permissions: create, edit and delete open requests, change status, filter, and view the dashboard.

### User Stories and Acceptance Criteria

- **US-01 Login / US-02 Logout**: username and password required. Failure returns a generic 401. The session is a JWT in an httpOnly cookie (8 hours). Logout clears the cookie. Kong and the UI reject anonymous access.
- **US-03 Create request**: Title (3 to 120 characters), Description (10 to 2000), Category (TI, RH, Compras, Financeiro, Infraestrutura). Requester and creation date are automatic. Status starts as Aberto. The code `SOL-000123` comes from the id.
- **US-04 Edit open request**: only status Aberto. Editable fields: Title, Description, Category. Otherwise the API returns 409.
- **US-05 Delete open request**: only status Aberto, after a confirmation dialog. Otherwise 409.
- **US-06 List requests**: columns Código, Título, Categoria, Solicitante, Data de abertura, Status. Server-side pagination (`page`, `limit`, default 10, maximum 50). Newest first. The response includes total and total pages.
- **US-07 View details**: all fields, created and updated timestamps. Unknown id returns 404 with a friendly page.
- **US-08 Change status**: Aberto to Em Atendimento to Concluído. Other transitions return 409. Concluído is final.
- **US-09 Filter**: period (inclusive), category, status, free text on title (case-insensitive, partial). Filters combine with AND, live in the URL, and clear with one action.
- **US-10 Dashboard**: Total, Abertas, Em atendimento, Concluídas. Total equals the sum of the three. Values reflect every write on the next load.
- **US-11 Interface**: follows `docs/design-system.md`. Light and dark themes. Responsive from 360 px. Loading skeletons, empty states, and error toasts. Copy follows the Átrio copy rules in pt-BR.
- **US-12 Keyboard and motion**: shortcuts `g` then `1` to `4`, `?`, `d`, `/`. `Escape` closes dialogs. `prefers-reduced-motion` turns every animation into an instant cut.
- **US-13 Traceability**: every response carries `X-Correlation-ID`. Every log line for that request carries the same id.

### BDD Features (living documentation)

Files live in `/features/*.feature`. No Cucumber runner executes them. Each scenario title matches one Jest test name. A CI script fails when a scenario has no matching test.

```gherkin
Feature: Authentication
  Scenario: Successful login
    Given a registered user "ana" with password "demo123"
    When she logs in with those credentials
    Then she receives a session cookie
  Scenario: Invalid credentials
    When a user logs in with a wrong password
    Then the response is 401 with a generic message
  Scenario: Unauthenticated access is blocked
    When an anonymous client calls GET /requests
    Then Kong responds 401

Feature: Request registration
  Scenario: Create a valid request
    Given I am logged in
    When I create a request "Replace monitor" in category "TI"
    Then it is saved with status "Aberto", my user as requester, and a creation date
  Scenario: Reject invalid data
    When I create a request with an empty title
    Then the response is 400 and lists the title field error
  Scenario: Edit or delete only while open
    Given a request with status "Em Atendimento"
    When I try to edit or delete it
    Then the response is 409 with code "REQUEST_NOT_EDITABLE"

Feature: Status management
  Scenario Outline: Allowed and forbidden transitions
    Given a request with status "<from>"
    When I change its status to "<to>"
    Then the result is "<result>"
    Examples:
      | from           | to             | result   |
      | Aberto         | Em Atendimento | accepted |
      | Em Atendimento | Concluído      | accepted |
      | Aberto         | Concluído      | rejected |
      | Concluído      | Aberto         | rejected |

Feature: Search, filters and pagination
  Scenario: Combine filters
    When I filter by category "TI", status "Aberto" and title containing "monitor"
    Then only requests matching all three criteria are returned
  Scenario: Period filter is inclusive
    When I filter from 2026-10-01 to 2026-10-02
    Then requests created on both boundary days are included
  Scenario: Paginate results
    Given 25 requests exist
    When I request page 2 with limit 10
    Then I receive 10 items, total 25, and total pages 3

Feature: Dashboard and cache
  Scenario: Counters reflect the data
    Given 5 Aberto, 3 Em Atendimento and 2 Concluído requests
    Then the dashboard shows Total 10, Abertas 5, Em atendimento 3, Concluídas 2
  Scenario: Dashboard is fresh after a write
    Given the dashboard was loaded and cached
    When I create a new request
    Then the next dashboard load shows the new totals
  Scenario: System works without Redis
    Given Redis is unavailable
    When I list requests
    Then I receive correct results from the database

Feature: Observability
  Scenario: Every request has a correlation id
    When I call any API endpoint
    Then the response has "X-Correlation-ID"
    And every log line for that request contains the same id
  Scenario: Sensitive data is never logged
    When I log in with password "demo123"
    Then no log line contains "demo123" or the session token
  Scenario: Failed login is logged as a warning
    When a user logs in with a wrong password
    Then a "auth.login.failed" line with level "warn" is written

Feature: Interface accessibility
  Scenario: Dialog closes with Escape
    Given the delete confirmation dialog is open
    When I press Escape
    Then the dialog closes and focus returns to the trigger
  Scenario: Reduced motion
    Given the user prefers reduced motion
    When I open the dashboard
    Then the counters show final values without animation
  Scenario: Theme toggle
    When I press "d"
    Then the theme switches and the choice persists after reload

Feature: Motion vocabulary
  Scenario: Animations touch only allowed properties
    When the motion guard scans the stylesheets and animation code
    Then it finds no animated width, height, top, left, margin, or padding
    And it finds no "transition: all"
  Scenario: Screen transition swaps at the midpoint
    Given the Íris transition runs
    Then the page swap happens in the "onMid" callback and total time is under 700 ms
  Scenario: Reduced motion on the dashboard
    Given the user prefers reduced motion
    Then no Number scramble, parallax, magnetic hover, or cursor trail runs

Feature: Icon vocabulary
  Scenario: Icon-only buttons are named
    When any button renders only an icon
    Then it has an accessible name and a hit area of at least 44 by 44 px
  Scenario: Status is never shown by icon or color alone
    When a status appears in the list or the details page
    Then the status text is visible
  Scenario: Icons come from the registry
    When code imports an icon library directly outside "Icon.tsx"
    Then lint fails
```

### Non-Goals

- Multiple roles, user management, registration, password reset.
- Comments, attachments, notifications, assignment, audit history screen.
- Automatic deploy to a cloud environment (CD stops at publishing images).
- Microservices, CQRS, event sourcing, message brokers.
- Cucumber runner. Redis for sessions. Log shipping to a central platform (documented as a future step).
- Browser-side error shipping to the backend.

---

## 3. AI System Requirements

Not applicable.

---

## 4. Technical Specifications

### Stack (pinned where Átrio pins)

| Layer | Choice |
| --- | --- |
| Frontend | Next.js 14.2.15 (App Router), React 18.3.1, TypeScript 5.6.2 (strict), Tailwind 3.4.13, shadcn/ui as local copies, GSAP 3.14.0, react-hook-form, zod |
| Fonts | `next/font/google`: Archivo Black, Anton, Inter, IBM Plex Mono |
| Backend | NestJS (latest stable at scaffold time), TypeScript, class-validator, nestjs-pino, @nestjs/swagger |
| Data | PostgreSQL, ORM TBD (Prisma or TypeORM), Redis (ioredis) |
| Gateway | Kong, DB-less |
| Tests | Jest, Supertest, Testcontainers, Testing Library, k6, Storybook test runner |
| Quality | ESLint, Prettier, Husky, lint-staged, commitlint |
| Delivery | Docker, Docker Compose, GitHub Actions, GHCR |

### Architecture Overview

```
Browser -> Next.js (3000) -> Kong (8000) -> NestJS (3001) -> PostgreSQL
                                                  |-> Redis (cache)
```

Next.js proxies `/api/*` to Kong with a rewrite. The browser sees one origin. Kong is the only entry point to the API. In the production compose file, NestJS, PostgreSQL, and Redis have no published ports.

**Kong (one `kong.yml`)**:

- Public route: `POST /api/v1/auth/login` (strict rate limit).
- Protected routes: `jwt` plugin reads the token from the cookie (`cookie_names`). NestJS signs HS256 tokens with an `iss` claim that equals the Kong consumer key.
- Global plugins: `cors`, `rate-limiting` (higher limit in the `load` profile), `correlation-id` (header `X-Correlation-ID`, echoed downstream), `file-log` to `/dev/stdout` in JSON.
- Swagger UI route: enabled in non-production profiles only.
- NestJS verifies the token again. Kong is never the only barrier.

**Backend layout (Clean Architecture, modular monolith)**:

```
apps/backend/src/
  shared/              Result, base errors, Clock, CachePort, LoggerPort
  modules/
    auth/
      domain/          User, PasswordHasher port
      application/     LoginUseCase, GetCurrentUserUseCase
      infrastructure/  bcrypt, JWT service, user repository
      presentation/    AuthController, DTOs
    requests/
      domain/          Request (aggregate root), Status and Category value
                       objects, RequestRepository port, domain errors
      application/     CreateRequest, UpdateRequest, DeleteRequest,
                       ChangeRequestStatus, GetRequest, ListRequests,
                       GetDashboardSummary
      infrastructure/  ORM entities, repository, mappers,
                       RedisCacheAdapter, caching repository decorator
      presentation/    RequestsController, DTOs, exception filter
  health/              /health/live, /health/ready (database and Redis)
  logging/             pino config, redaction, correlation middleware
```

The dependency rule is fixed. Presentation and infrastructure depend on application. Application depends on domain. Domain depends on nothing. An ESLint boundaries rule enforces this.

**DDD, lightweight**: one aggregate (`Request`) enforces its invariants. Only status Aberto allows edit or delete. `Status.next()` owns the transitions. `Status` and `Category` are value objects. Use cases are application services. One exception filter maps domain errors to HTTP codes. Not used: domain events, specifications, separate read models.

**Caching (Redis, cache-aside)**: the `CachePort` is in `shared`. The adapter and a caching decorator around the repository are in infrastructure. Use cases do not know Redis exists.

- Keys: `dashboard:summary` (TTL 30 s) and `requests:list:{version}:{hash(filters,page,limit)}` (TTL 60 s).
- Every write deletes `dashboard:summary` and increments `requests:version`. All list keys become stale at once.
- A Redis failure is logged as `cache.error` and the request falls back to the database.
- `CACHE_ENABLED=false` switches the layer off.
- Next.js uses `no-store` for authenticated data. Only the static category list uses the Next.js cache.

### Frontend: Átrio integration

`docs/design-system.md` is the single source of truth for visual and motion rules. Divergence between code and that document is fixed in the code.

**Binding rules (summary)**:

- Tokens as CSS variables for light and dark. Every color has a declared role. No decorative color.
- Borders are 2 px ink. Radius is 2 px. Shadows are solid offsets with no blur. Focus uses `:focus-visible` with a 3 px yellow outline.
- Badges use a 7×7 colored square and never a colored fill. Status colors: blue (Aberto), terra (Em Atendimento), moss (Concluído). State is never shown by color alone.
- Animations change only `transform`, `opacity`, and `clip-path`. No `transition: all`. No layout properties.
- Anti-patterns in section 11 of the design system are PR blockers.
- Server Components pass only serializable props to Client Components.
- WCAG 2.2 AA. Targets of 44×44 px on mobile. Focus moves to the page heading after each screen transition. Dialogs trap focus.

**Decisions where the brief and Átrio differ**:

| Topic | Decision | Reason |
| --- | --- | --- |
| Status labels | ABERTO, EM ATENDIMENTO, CONCLUÍDO | The brief names these states. The design system is revised to v1.1 |
| Animation library | GSAP only (Framer Motion dropped) | Átrio motion vocabulary and transitions use GSAP |
| Theme | Light and dark both required | Átrio treats two tested themes as part of the brand |
| Routes | `/login`, `/dashboard`, `/lista`, `/lista/nova`, `/lista/[id]`, `/lista/[id]/editar`. `/` redirects to `/dashboard`, or to `/login` without a session | Átrio redirects `/` to a gallery page. This portal needs a working home |
| `/transicoes` gallery | Optional developer route, first item in the cut order | Storybook already documents motion for review |
| Motion scope | Subset of the 14 patterns for the minimum tier (entrada orquestrada, number scramble, stagger cascade, underline draw, focus pulse, ripple click) plus the Íris screen transition. The rest are differentials | Time. Every animation still belongs to one of the 14 patterns |
| Language | UI copy in pt-BR following Átrio copy rules. Code, API, and logs in English | Audience is Brazilian. Engineering artifacts stay in English |

**Folder structure**: the Átrio structure is normative (`app/`, `components/`, `context/`, `lib/transitions/`). Additions: `components/ui/` (shadcn local copies), `components/domain/` (`StatusBadge`, `CategoryTag`, `RequestsTable`, `FilterBar`, `ConfirmDialog`, `EmptyState`, `StatCard`), `lib/api/` (typed client), `lib/logger.ts`, `stories/`.

**Storybook**: stories for the domain components and the core `ui` components, with controls, docs pages, light and dark, and the accessibility addon. The Átrio Definition of Done requires a story for each domain component. Visual regression uses the Storybook test runner with image snapshots.

### Motion vocabulary

The Átrio vocabulary has 14 patterns. Every animation in the product belongs to one of them. Anything else is a PR blocker. Details and tokens are in `docs/design-system.md`, sections 6, 7, and 18.

#### Rules

- Animate only `transform`, `opacity`, and `clip-path`.
- Never use `transition: all` and never use `linear` on text the user reads.
- Entry uses ease-out. Exit uses ease-in. A screen transition lasts 400 to 700 ms and swaps the page in `onMid`.
- Each screen has one main gesture. Micro-interactions are allowed. Competing gestures are not.
- `prefers-reduced-motion` turns every animation into an instant cut. Counters show the final value. Cursor trail, magnetic hover, and parallax switch off.
- CSS runs the micro-interactions. GSAP 3.14.0 runs orchestration and is imported dynamically in Client Components.

#### Pattern tiers

| Pattern | Tier | Used on | Implementation |
| --- | --- | --- | --- |
| Entrada orquestrada | Minimum | Every screen, dialog, toast | CSS |
| Number scramble | Minimum | Dashboard counters | GSAP |
| Stagger cascade | Minimum | List rows on first load | GSAP |
| Underline draw | Minimum | Navigation links | CSS |
| Focus pulse | Minimum | Inputs with errors, rows, badges | CSS |
| Ripple click | Minimum | Buttons | CSS |
| Íris (screen transition) | Minimum | All screen changes | GSAP |
| Draw sequencial | Differential | Login fan | GSAP |
| Rotação radial | Differential | Loading mark, theme icon swap | GSAP and CSS |
| Scher wipe (Varredura) | Differential | Optional screen transition | GSAP |
| Grade Mudéjar (tile transition) | Differential | Optional screen transition | GSAP |
| Split-char reveal | Differential | Section titles, with `aria-label` kept | GSAP |
| Magnetic hover | Differential | Primary buttons, `pointer: fine` only | GSAP |
| Cascade 3D flip | Differential | Table rows and motifs | GSAP |
| Cursor trail | Differential | Login hero, `pointer: fine` only | GSAP |
| Scroll parallax | Differential | Mudéjar band | GSAP |

**Main gesture per screen**: Login, Draw sequencial (fallback Entrada orquestrada). Dashboard, StatCard entry with Number scramble. List, Stagger cascade on first load only. Create and edit, Entrada orquestrada. Details, Entrada orquestrada. Dialog, entry with `--ease-expo`. Toast, 250 ms `transform` and `opacity`.

**Motion tokens**: `--dur-micro` 220 ms, `--dur-base` 450 ms, `--dur-slow` 700 ms, `--ease-out`, `--ease-in`, `--ease-expo` (values in the design system, section 18.1).

**Resolved divergence**: the design system lists "Scher wipe" at 800 ms in section 6 and at 500 ms in section 7. Section 7 and its 400 to 700 ms rule win.

**Guards**: Stylelint blocks `transition: all` and layout properties in transitions. A Jest scan checks GSAP calls for forbidden properties. A Storybook story shows each implemented pattern with a reduced-motion toggle.

### Icon vocabulary

Icons are functional glyphs. They are separate from the five brand motifs (medalhão, leque, arco, chevron, azulejo). Details are in `docs/design-system.md`, section 17.

#### Specification

- One library: `lucide-react`, imported only inside `components/ui/Icon.tsx`.
- Stroke width 2, square caps, miter joins, no fill, `currentColor` only.
- Sizes 16, 20, and 24 px. Hit area of 44×44 px for icon-only buttons on mobile.
- Icon-only buttons have `aria-label` and `title`. Icons next to text have `aria-hidden`.
- Server Components pass only the icon name (a string) to Client Components, never the component.

#### Inventory (semantic name to purpose)

| Group | Names |
| --- | --- |
| Navigation | `dashboard`, `list`, `menu`, `user`, `logout`, `shortcuts` |
| Actions | `add`, `edit`, `delete`, `details`, `advance`, `filter`, `search`, `clear`, `calendar` |
| Theme | `theme-light`, `theme-dark` |
| Feedback | `success`, `error`, `warning`, `info` |
| Status (details and timeline only) | `status-open`, `status-progress`, `status-done` |
| Category (form and details, optional) | `cat-ti`, `cat-rh`, `cat-compras`, `cat-financeiro`, `cat-infra` |

#### Rules

- The badge keeps its 7×7 square and takes no icon. The badge text satisfies the rule that state never relies on color alone.
- Table rows use icons only for actions, always with visible text or an accessible name.
- Loading uses the Medalhão with Rotação radial. No spinner icon.
- Icons do not animate. The only exception is the theme icon swap (250 ms rotation and cross-fade).
- Adding an icon requires a semantic name, a declared use, and a Storybook story.

**Guards**: ESLint `no-restricted-imports` on the library, a registry test that resolves every name, and accessible-name checks in Storybook.

### Data Model (PostgreSQL)

`users`: id (PK), username (UNIQUE, NOT NULL), name, password_hash (NOT NULL), created_at (timestamptz).

`requests`: id (bigserial PK), title, description, category (enum, 5 values), status (enum `OPEN`, `IN_PROGRESS`, `DONE`, default `OPEN`), requester_id (FK to users, NOT NULL), created_at and updated_at (timestamptz, default now()).

Indexes: status, category, created_at DESC, and a `pg_trgm` GIN index on title for `ILIKE`.

Deliverables: versioned migrations, `database/schema.sql`, `database/seed.sql` (2 demo users, about 20 requests), a script that seeds 1,000 rows for load tests, and `docs/data-dictionary.md`. The ORM stays inside infrastructure.

### API and API Documentation

Routes (prefix `/api/v1`):

| Method | Route | Purpose |
| --- | --- | --- |
| POST | /auth/login | Authenticate, set cookie |
| POST | /auth/logout | Clear cookie |
| GET | /auth/me | Current user |
| GET | /requests | List with `from`, `to`, `category`, `status`, `q`, `page`, `limit` |
| POST | /requests | Create |
| GET | /requests/:id | Details |
| PATCH | /requests/:id | Edit (Aberto only) |
| DELETE | /requests/:id | Delete (Aberto only) |
| PATCH | /requests/:id/status | Change status |
| GET | /dashboard/summary | Counters |
| GET | /health/live, /health/ready | Probes |

Rules:

- Paginated body: `{ data: [], meta: { page, limit, total, totalPages } }`.
- Error body: `{ statusCode, code, message, errors[], correlationId }`.
- Error catalog: 400 `VALIDATION_ERROR`, 401 `UNAUTHENTICATED`, 404 `NOT_FOUND`, 409 `REQUEST_NOT_EDITABLE` and `INVALID_STATUS_TRANSITION`, 429 `RATE_LIMITED`, 500 `INTERNAL_ERROR`.
- Swagger UI at `/api/docs`, generated from decorated DTOs. Every endpoint has a summary, request example, success example, and error examples.
- `npm run docs:api` exports `docs/api/openapi.yaml`. CI runs it and fails when the file differs from the committed copy.
- `docs/api/README.md` explains authentication through Kong, pagination, filters, the error catalog, and `curl` examples.

### Logging (structured, documented)

All services write JSON to stdout, one object per line. The backend and the Next.js server use pino. Kong uses the `file-log` plugin. Docker rotates files (`json-file`, 10 MB, 5 files). View logs with `docker compose logs -f backend | jq`.

**Schema (backend and frontend server)**:

| Field | Type | Rule |
| --- | --- | --- |
| `ts` | string | ISO 8601, UTC |
| `level` | string | `debug`, `info`, `warn`, `error` |
| `service` | string | `backend`, `frontend`, `kong` |
| `env`, `version` | string | From configuration |
| `correlationId` | string | From `X-Correlation-ID`. Generated if absent |
| `userId` | number | Present when authenticated |
| `event` | string | Stable name from the event catalog |
| `module`, `useCase` | string | Present for application events |
| `msg` | string | Short human text |
| `durationMs` | number | Present for completed operations |
| `http` | object | `method`, `path`, `status` |
| `data` | object | Event fields. Entity ids and categories only |
| `error` | object | `type`, `message`, `stack` (stack only outside production) |

**Level policy**: `error` for unexpected failures and 5xx. `warn` for expected rule violations, failed login, rate limits, and cache or health degradation. `info` for state changes and request completion. `debug` for cache hit and miss (off in production).

**Event catalog** (documented in `docs/logging.md` with one example line each): `app.started`, `app.shutdown`, `db.migration.applied`, `http.request.completed`, `auth.login.succeeded`, `auth.login.failed`, `auth.logout`, `request.created`, `request.updated`, `request.deleted`, `request.status_changed`, `request.rule_violation`, `cache.error`, `cache.invalidated`, `health.degraded`, `unhandled.error`.

**Privacy rules**: redact `password`, `passwordHash`, `authorization`, `cookie`, `set-cookie`, and `token`. Never log request bodies or descriptions. Log entity ids and categories only.

**Tests**: a unit test for redaction, an e2e test that checks the correlation id on the response and on log lines, and a schema validation test for each event in the catalog.

### Test Strategy

| Level | Scope | Tooling | Runs |
| --- | --- | --- | --- |
| Unit | Domain, use cases with in-memory fakes, logger redaction | Jest | every push |
| Integration | Repository on real PostgreSQL, Redis adapter and invalidation, auth with bcrypt and JWT | Jest + Testcontainers | every push |
| E2E | API over HTTP, one test per BDD scenario | Jest + Supertest | every push |
| Stack smoke | Login and a request lifecycle through Kong | Jest + Supertest on `localhost:8000` | CI after image build |
| Frontend | Forms, filter bar, theme, keyboard behavior | Jest + Testing Library | every push |
| Component docs | Stories render. Accessibility checks pass | Storybook test runner | CI |
| Visual regression | Domain component stories in light and dark | Storybook test runner with image snapshots | CI (differential) |
| Motion and icon guards | Stylelint (no `transition: all`, no layout properties), a Jest scan of GSAP calls for forbidden properties, ESLint `no-restricted-imports` for the icon library, icon registry test, accessible-name checks | Stylelint, ESLint, Jest, Storybook a11y | every push |
| Load and performance | Login, filtered list, create, dashboard, with and without cache | k6 through Kong | manual and nightly |

### Quality and Developer Workflow

- ESLint (TypeScript, import rules, layer boundaries), Prettier, EditorConfig.
- Husky: `pre-commit` runs lint-staged. `commit-msg` runs commitlint (Conventional Commits). `pre-push` runs type-check and unit tests.
- Trunk-based flow with short branches and a pull request template.

### Docker and Deploy

- `docker-compose.yml` (development) and `docker-compose.prod.yml` (production-like). Services: `frontend`, `backend`, `kong`, `postgres`, `redis`. Profiles: `load` (k6).
- Multi-stage Dockerfiles, non-root users, health checks, `depends_on` with health conditions, named volumes.
- The backend runs migrations and seed on first start (idempotent). Configuration is validated at boot. Missing variables stop the app with a clear message. Graceful shutdown is on.
- README quick start: `cp .env.example .env && docker compose up --build`, then open `http://localhost:3000`. A `Makefile` wraps `up`, `down`, `test`, `e2e`, `load`, `sonar`, `storybook`, `docs`.

### CI/CD (GitHub Actions)

- `ci.yml` (push and PR): install, lint, type-check, commitlint (PR), unit, integration, e2e, frontend tests, OpenAPI drift check, BDD-to-test mapping check, Storybook build with accessibility checks, build, coverage threshold.
- `images.yml` (`main` and tags): build and push backend and frontend images to GHCR, scan with Trivy, start compose, run the Kong smoke test.
- `load.yml` (manual and nightly): compose with the `load` profile, k6 summary as an artifact.

### Security & Privacy

bcrypt hashes. Generic login errors. DTO whitelisting. Parameterized queries. Requester comes from the session only. Helmet. CORS limited at Kong. Rate limits. httpOnly SameSite cookie. Secrets only in environment variables. Dependency audit in CI. Trivy image scan. Log redaction as defined above. Demo credentials appear only in the README for evaluation.

---

## 5. Risks & Roadmap

### Phased Rollout (real dates)

Today is Friday, October 2. Work in tiers so a complete, documented core always exists.

- **Oct 2 (today): documentation and foundation.** Generate and audit the docs in section 6. Create the repo structure, hooks, and lint. Write schema, migrations, and seed. Write the domain, use cases, and their unit tests.
- **Oct 3: backend and UI core.** Controllers, auth, exception filter, filters, pagination, dashboard, logging, Swagger, e2e tests. Átrio tokens, light and dark, login, list, create, details, dashboard.
- **Oct 4: delivery.** Docker Compose, Kong, Redis cache with tests, CI, README and Memorial in pt-BR, screenshots, clean-clone run test. Motion subset and the Íris transition.
- **Oct 5 (Monday, deadline day): buffer.** Submit in the morning. Use leftover time for differentials only when every item above is green.

**Minimum submission tier** (never cut): login, CRUD with Aberto-only rules, status change, filters, pagination, dashboard, PostgreSQL schema and seed, data dictionary, README, Memorial, working `docker compose up`, Swagger, structured logs with correlation id, unit and e2e tests for the core use cases, Átrio tokens in light and dark.

**Cut order if late**: 1) visual regression snapshots, 2) GHCR and Trivy, 3) nightly load workflow (keep the k6 script and one recorded run), 4) Storybook beyond 4 components, 5) motion beyond the six patterns and Íris, 6) `/transicoes` gallery, 7) Redis (switch off with `CACHE_ENABLED=false` and document).

### Technical Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Scope exceeds 3 working days for one developer | Missing mandatory deliverables | Minimum tier, cut order, docs generated first by AI and reviewed by the developer |
| Kong JWT with cookie and `iss` mismatch | Valid users get 401 | Build the auth path early on Oct 4 with a smoke test. NestJS verification stays |
| Stale cache | Wrong dashboard totals | Invalidate on every write, short TTL, Cache scenarios in BDD |
| Redis outage | API errors | Fail-open fallback, `/health/ready` reports degraded state |
| Log leaks personal data | Privacy and security findings | Redaction list, no body logging, redaction tests |
| Átrio rules break in review (blur shadow, `transition: all`, layout animation) | PR blockers | ESLint and stylelint rules for the top anti-patterns, QA checklist in the PR template |
| Server to Client prop serialization errors with GSAP helpers | Runtime errors | Follow Átrio section 8: pure data on the server, behavior resolved by id on the client |
| Looks over-engineered for a junior test | Reviewer penalizes complexity | Memorial explains each choice, the flags, and what was not built |
| Developer cannot explain AI-drafted decisions | Interview risk | Developer reads and edits every document. The Memorial is written in the own words of the developer |

### Assumptions and Open Items

- All authenticated users can edit or delete any open request. A production system would limit this to the requester or an administrator. The Critical Analysis section of the Memorial says so.
- The status flow is forward only. Ask bit Soluções to confirm if time allows.
- Timestamps are stored in UTC and shown in America/Fortaleza.
- README and Memorial are written in pt-BR. All other engineering documents are in English. Confirm this choice.
- The offset pagination is simple on purpose. Cursor pagination is a future step.

---

## 6. Documentation Plan (docs before code)

This plan follows the Documentation Specialist skill (SpillwaveSolutions). Its documented rules apply: Markdown as the primary format, one voice pack (STE100) for all documents, Mermaid first for diagrams, PlantUML Salt for one wireframe per screen, and an audit pass before the documents are accepted.

| Document | Path | Skill workflow | Notes |
| --- | --- | --- | --- |
| PRD (this file) | `docs/prd.md` | greenfield, PRD template | Source of scope |
| SRS | `docs/srs.md` | greenfield, IEEE 830 template | Numbered FR and NFR ids. Each id maps to a BDD scenario and a test |
| Design document | `DESIGN_DOC.md` | design, arc42 | The 12 arc42 sections. Includes the Clean Architecture and DDD decisions |
| Architecture | `docs/architecture.md` | design, C4 short | Mermaid: context, container, component. Sequence: login through Kong, status change with cache invalidation. State: status lifecycle. ER diagram |
| OpenAPI | `openapi.yaml` and `docs/api/openapi.yaml` | greenfield, OpenAPI template | Generated from code later. Written first as the contract |
| API guide | `docs/api/README.md` | tutorial | Authentication, pagination, filters, error catalog, `curl` examples |
| Logging | `docs/logging.md` | greenfield | Schema, level policy, event catalog with examples, redaction, how to read logs |
| Data dictionary | `docs/data-dictionary.md` | greenfield | Tables, columns, types, constraints, indexes |
| Design system | `docs/design-system.md` | provided | Átrio v1.2. Adds the icon vocabulary (section 17) and the motion budget and tokens (section 18) |
| Wireframes | `docs/wireframes.md` | diagram, PlantUML Salt | One Salt wireframe per screen: login, dashboard, list, create and edit, details, delete dialog. Exported as PNG or SVG |
| Test strategy | `docs/testing-strategy.md` | greenfield | Pyramid, tools, thresholds, BDD mapping rule, load test profile |
| ADRs | `docs/adr/0001` to `0006` | greenfield | Clean Architecture lite, Kong, Redis cache, PostgreSQL, GSAP, structured logging |
| Runbook | `docs/runbook.md` | runbook | Start and stop, seed reset, Redis down, Kong 401, reading logs, backup of the database volume |
| Getting started and README | `README.md`, `docs/getting-started.md` | user-docs | Prerequisites, installation, configuration, run, demo users. In pt-BR |
| Memorial Técnico | `docs/memorial-tecnico.md` | greenfield | Mandatory deliverable. Technologies, technical and conceptual justification, critical analysis. In pt-BR |
| Contributing | `CONTRIBUTING.md` | greenfield | Conventional Commits, hooks, branch flow, PR checklist |
| Features | `features/*.feature` | n/a | The Gherkin files from section 2 |

**Generation order** (Oct 2): SRS, DESIGN_DOC, architecture, OpenAPI, data dictionary and `schema.sql`, logging, wireframes, testing strategy, ADRs, runbook, README and Memorial skeletons. Then run the audit workflow on the set and fix gaps.

**Definition of Ready for development**: every document above exists, requirement ids are consistent across PRD, SRS, features, and OpenAPI, and the audit finds no blocker.

**Voice rules for all documents**: short sentences, one instruction per step, active voice, no contractions, no Latin abbreviations, no em dashes, and no sentence that starts with So, That, Thus, or Hence.
