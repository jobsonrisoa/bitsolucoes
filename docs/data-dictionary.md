# Data Dictionary

## Table: users

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for the user |
| name | VARCHAR(255) | NOT NULL | Full name of the user |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| role | user_role (ENUM) | DEFAULT 'USER' | Role of the user (ADMIN or USER) |
| created_at | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Timestamp of creation |
| updated_at | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Timestamp of last update |

## Table: requests

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for the request |
| title | VARCHAR(255) | NOT NULL | Title of the request |
| description | TEXT | NOT NULL | Detailed description of the request |
| status | request_status (ENUM) | DEFAULT 'PENDING' | Status of the request (PENDING, IN_PROGRESS, COMPLETED, REJECTED) |
| requester_id | UUID | NOT NULL, REFERENCES users(id) ON DELETE RESTRICT | ID of the user who made the request |
| assignee_id | UUID | REFERENCES users(id) ON DELETE SET NULL | ID of the admin assigned to the request |
| created_at | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Timestamp of creation |
| updated_at | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | Timestamp of last update |

## Indexes

- `idx_requests_status` on `requests(status)`
- `idx_requests_requester_id` on `requests(requester_id)`
- `idx_requests_assignee_id` on `requests(assignee_id)`
- `idx_requests_title_trgm` on `requests USING gin (title gin_trgm_ops)`
- `idx_requests_created_at` on `requests(created_at DESC)`
