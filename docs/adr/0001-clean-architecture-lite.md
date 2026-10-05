# ADR 0001: Clean Architecture Lite

## Status

Accepted

## Context

We need a maintainable and testable architecture for the backend API, but full Clean Architecture can be overly verbose for this scope of this project.

## Decision

We will use a "Lite" version of Clean Architecture, separating concerns into Controllers, Services/Use Cases, and Repositories, without strict adherence to all interfaces and layers defined in the original pattern.

## Consequences

- Faster development speed while maintaining good separation of concerns.
- Easier to write unit tests.
- Slight coupling to framework/database might occur but is deemed acceptable.
