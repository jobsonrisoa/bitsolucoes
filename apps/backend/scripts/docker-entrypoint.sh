#!/bin/sh
set -e

# Run Prisma migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
  echo "[INFO] Running Prisma migrations..."
  npx prisma migrate deploy || echo "[WARN] Migration failed or already applied"

  # Generate Prisma client
  echo "[INFO] Generating Prisma client..."
  npx prisma generate
fi

# Execute the main command
exec "$@"
