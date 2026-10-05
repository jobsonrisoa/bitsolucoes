# API Documentation

## Authentication

Authentication is handled via Kong.

1. Obtain a JWT token by logging in.
2. The token is stored in an HttpOnly cookie named `session`.
3. Kong validates the token and forwards requests to the protected API endpoints.

## Pagination and Filters

Endpoints returning collections support pagination and filtering.

- Pagination parameters: `page`, `limit`
- Filter parameters: e.g., `status=PENDING`, `search=VPN`

## Error Catalog

- `400 Bad Request`: Validation errors.
- `401 Unauthorized`: Missing or invalid JWT.
- `403 Forbidden`: Insufficient permissions.
- `404 Not Found`: Resource does not exist.
- `500 Internal Server Error`: Unexpected system failure.

## Curl Examples

### Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"ana","password":"demo123"}' \
     -c cookies.txt
```

### List Requests (Protected)

```bash
curl -X GET "http://localhost:8000/api/v1/requests?page=1&limit=10" \
     -b cookies.txt
```
