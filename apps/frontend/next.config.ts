import { existsSync } from 'fs';
import { resolve } from 'path';
import type { NextConfig } from 'next';

// Only load the monorepo-root .env when running outside Docker (local dev).
const rootEnv = resolve(__dirname, '../../.env');
if (existsSync(rootEnv) && typeof process.loadEnvFile === 'function') {
  process.loadEnvFile(rootEnv);
}

// Resolved at BUILD time and baked into routes-manifest.json.
// Inside docker-compose it must be http://kong:8000.
// Locally (host) it should be http://localhost:8000 (Kong on host).
const apiOrigin = process.env.INTERNAL_API_URL ?? 'http://localhost:8000';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;