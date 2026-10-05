CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TYPE "RequestStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE');
CREATE TYPE "RequestCategory" AS ENUM ('TI', 'RH', 'COMPRAS', 'FINANCEIRO', 'INFRAESTRUTURA');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requests (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    category "RequestCategory" NOT NULL,
    status "RequestStatus" DEFAULT 'OPEN',
    requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_category ON requests(category);
CREATE INDEX idx_requests_title_trgm ON requests USING gin (title gin_trgm_ops);
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);
