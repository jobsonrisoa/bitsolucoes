#!/bin/bash
set -euo pipefail

# Ensures atrio_test exists and has the application schema.
# Safe to re-run against an already-initialized Docker volume.
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCHEMA_FILE="${ROOT_DIR}/database/schema.sql"
POSTGRES_CONTAINER="$(docker compose -f "${ROOT_DIR}/docker-compose.yml" ps -q postgres)"

if [ -z "${POSTGRES_CONTAINER}" ]; then
  echo "[ERROR] Postgres container is not running. Start it with: npm run docker:up"
  exit 1
fi

echo "[INFO] Ensuring database atrio_test exists..."
docker exec -i "${POSTGRES_CONTAINER}" psql -U atrio -d atrio -v ON_ERROR_STOP=1 <<-EOSQL
SELECT 'CREATE DATABASE atrio_test OWNER atrio'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'atrio_test')\gexec
EOSQL

echo "[INFO] Applying schema to atrio_test..."
docker exec -i "${POSTGRES_CONTAINER}" psql -U atrio -d atrio_test -v ON_ERROR_STOP=1 < "${SCHEMA_FILE}" \
  || echo "[WARN] Schema may already be applied on atrio_test"

echo "[SUCCESS] Test database atrio_test is ready"
echo "         DATABASE_URL_TEST=postgresql://atrio:atrio@localhost:5432/atrio_test"
