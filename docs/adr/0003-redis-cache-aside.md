# ADR 0003: Redis Cache-Aside

## Status

Accepted

## Context

Dashboard and frequently accessed list endpoints need to be performant and reduce database load.

## Decision

Implement a Cache-Aside pattern using Redis.

## Consequences

- Improved read performance.
- Needs cache invalidation logic in the backend upon data mutations.
- Introduces Redis as an additional infrastructure component.
