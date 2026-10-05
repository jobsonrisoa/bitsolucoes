# Logging Strategy

## Schema

All logs are structured as JSON for easier ingestion and querying.

## Level Policy

- **ERROR**: System failures that require immediate attention (for example, database connection loss, unhandled exceptions).
- **WARN**: Unexpected situations that do not immediately halt the system but may require investigation (for example, rate limit reached).
- **INFO**: Important lifecycle events (for example, application startup, successful login).
- **DEBUG**: Detailed information useful for debugging in development.

## Event Catalog with JSON Examples

### Application Startup

```json
{
  "level": "info",
  "message": "Application started successfully",
  "timestamp": "2026-10-02T10:00:00Z",
  "service": "atrio-backend",
  "port": 3001
}
```

### Request Status Change

```json
{
  "level": "info",
  "message": "Request status updated",
  "timestamp": "2026-10-02T10:05:00Z",
  "service": "atrio-backend",
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "oldStatus": "PENDING",
  "newStatus": "IN_PROGRESS",
  "correlationId": "abc-123"
}
```

## Redaction Rules

- Passwords and `password_hash` are never logged.
- JWT tokens and session cookies are redacted or omitted.
- Personally Identifiable Information (PII) like email is masked where appropriate in generic logs.
