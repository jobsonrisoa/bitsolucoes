# Architecture

## Diagrams

### C4 Context

```mermaid
graph TD
    User(User) -->|Interacts with| Frontend(Átrio Frontend)
    Frontend -->|API calls| API_Gateway(Kong API Gateway)
    API_Gateway -->|Routes & Auth| Backend(Átrio Backend API)
```

### Sequence Diagram: Login via Kong

```mermaid
sequenceDiagram
    participant Client
    participant Kong
    participant Backend

    Client->>Kong: POST /api/v1/auth/login
    Kong->>Backend: Forward request
    Backend-->>Kong: Validate credentials, generate JWT
    Kong-->>Client: Set-Cookie: session=JWT
```

### Sequence Diagram: Status Change & Cache Invalidation

```mermaid
sequenceDiagram
    participant Admin
    participant Kong
    participant Backend
    participant DB
    participant Cache

    Admin->>Kong: PATCH /api/v1/requests/{id}/status
    Kong->>Backend: Forward request (Validated JWT)
    Backend->>DB: Update request status
    DB-->>Backend: Success
    Backend->>Cache: Invalidate related cache keys
    Cache-->>Backend: Success
    Backend-->>Kong: 200 OK
    Kong-->>Admin: 200 OK
```

### State Diagram: Request Lifecycle

```mermaid
stateDiagram-v2
    [*] --> PENDING
    PENDING --> IN_PROGRESS
    PENDING --> REJECTED
    IN_PROGRESS --> COMPLETED
    IN_PROGRESS --> REJECTED
    COMPLETED --> [*]
    REJECTED --> [*]
```

### ER Diagram

```mermaid
erDiagram
    users {
        uuid id PK
        string name
        string email UK
        string password_hash
        string role
    }
    requests {
        uuid id PK
        string title
        string description
        string status
        uuid requester_id FK
        uuid assignee_id FK
    }

    users ||--o{ requests : creates
    users ||--o{ requests : assigned_to
```
