# ADR 0006: Structured Logging

## Status

Accepted

## Context

Logs need to be easily searchable and parsed by centralized logging systems for better observability.

## Decision

Adopt structured logging (JSON format) across all services.

## Consequences

- Easier integration with log aggregators.
- Better querying capabilities.
- Slightly harder to read in raw terminal output without a formatter.
