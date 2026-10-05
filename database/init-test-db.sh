#!/bin/bash
set -euo pipefail

# Creates the isolated integration-test database and applies the same schema
# as production/dev. Seed data is intentionally omitted so tests start clean.
DB_EXISTS="$(psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -Atc \
  "SELECT 1 FROM pg_database WHERE datname = 'atrio_test'")"

if [ "$DB_EXISTS" != "1" ]; then
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
    -c "CREATE DATABASE atrio_test OWNER ${POSTGRES_USER};"
fi

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname atrio_test \
  -f /docker-entrypoint-initdb.d/1-schema.sql
