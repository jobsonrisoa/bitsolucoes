.PHONY: help setup install up down restart build dev test test-unit test-integration test-e2e test-frontend type-check lint storybook load logs seed clean

# Default: exibe ajuda com os comandos disponíveis
help:
	@echo "Átrio - Comandos disponíveis:"
	@echo "  make setup            - Setup completo (npm install, .env, Playwright, Docker, migrations)"
	@echo "  make install          - Instala dependências npm do monorepo"
	@echo "  make up               - Sobe todos os containers Docker em background"
	@echo "  make down             - Para e remove os containers Docker"
	@echo "  make restart          - Reinicia os containers Docker"
	@echo "  make build            - Compila as aplicações (NestJS e Next.js)"
	@echo "  make dev              - Executa backend e frontend em modo desenvolvimento"
	@echo "  make test             - Executa todos os testes unitários"
	@echo "  make test-unit        - Executa testes unitários"
	@echo "  make test-integration - Executa testes de integração (backend + DB test)"
	@echo "  make test-e2e         - Executa testes ponta a ponta (E2E)"
	@echo "  make test-frontend    - Executa testes do frontend"
	@echo "  make type-check       - Validação estática de tipos TypeScript"
	@echo "  make lint             - Validação de linting"
	@echo "  make storybook        - Inicia o Storybook do frontend na porta 6006"
	@echo "  make load             - Executa testes de carga k6"
	@echo "  make logs             - Exibe logs em tempo real do Docker"
	@echo "  make seed             - Aplica seed no PostgreSQL"
	@echo "  make clean            - Remove containers e volumes Docker"

# Setup e instalação
setup:
	npm run setup

install:
	npm run install:all

# Ciclo de vida Docker
up:
	npm run docker:up

down:
	npm run docker:down

restart:
	npm run docker:restart

# Build e Desenvolvimento
build:
	npm run build

dev:
	npm run dev

# Testes e Qualidade
test:
	npm run test

test-unit:
	npm run test:unit

test-integration:
	npm run test:integration

test-e2e:
	npm run test:e2e

test-frontend:
	npm run test:frontend

type-check:
	npm run type-check

lint:
	npm run lint

storybook:
	npm run storybook

load:
	docker run --rm -i --network=host -v $(PWD):/scripts grafana/k6 run /scripts/k6/load-test.ts

logs:
	npm run docker:logs

seed:
	docker compose exec postgres psql -U atrio -d atrio -f /docker-entrypoint-initdb.d/2-seed.sql

clean:
	docker compose down -v --remove-orphans
