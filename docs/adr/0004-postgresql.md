# ADR 0004: PostgreSQL as Main Database

## Status

Accepted

## Context

We need a robust, relational database for storing users and requests with ACID compliance and full-text search capabilities.

## Decision

Use PostgreSQL 16.

## Consequences

- Reliable data storage.
- Can leverage `pg_trgm` extension for efficient text search on request titles.
- Requires schema management and migrations.
