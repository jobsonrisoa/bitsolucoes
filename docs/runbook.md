# Runbook

## Start/Stop the System

Start all services:

```bash
make up
```

Stop all services:

```bash
make down
```

## Seed Reset

Reset and re-seed the database:

```bash
make clean
make up
sleep 10 # wait for db to start
make seed
```

## Troubleshooting

### Redis Down

If Redis crashes, the application is designed with Cache-Aside. It should fallback gracefully to the database, but performance might degrade. Restart Redis:

```bash
docker compose restart redis
```

### Kong returns 401 Unauthorized

- Ensure the JWT token is present in the `session` cookie.
- Verify that `JWT_SECRET` in backend matches `KONG_JWT_SECRET`.
- Check if the token has expired.

### Reading Logs

Use Docker Compose to tail logs:

```bash
make logs
```

Or for a specific service:

```bash
docker compose logs -f backend
```
