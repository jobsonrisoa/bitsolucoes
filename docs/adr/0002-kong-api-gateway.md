# ADR 0002: Kong API Gateway

## Status

Accepted

## Context

We need to manage API routing, authentication (JWT validation), rate limiting, and CORS without cluttering the backend services.

## Decision

We will use Kong API Gateway in DB-less (declarative) mode.

## Consequences

- Centralized API management.
- Backend services are protected and do not need to implement rate limiting.
- Configuration is version-controlled via `kong.yml`.
