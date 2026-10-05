#!/usr/bin/env node

import http from 'http';
import net from 'net';
import type { IncomingMessage, ServerResponse } from 'http';

interface Service {
  name: string;
  port: number;
  path: string;
  type: 'tcp' | 'http';
}

const services: Service[] = [
  { name: 'PostgreSQL', port: 5432, path: '', type: 'tcp' },
  { name: 'Redis', port: 6379, path: '', type: 'tcp' },
  { name: 'Kong', port: 8000, path: '/', type: 'http' },
  { name: 'Frontend', port: 3000, path: '/api/health', type: 'http' },
];

const MAX_RETRIES = 60;
const RETRY_INTERVAL = 2000;

function checkService(service: Service): Promise<boolean> {
  return new Promise((resolve) => {
    if (service.type === 'tcp') {
      const client = new net.Socket();
      client.setTimeout(2000);

      client.on('connect', () => {
        client.destroy();
        resolve(true);
      });

      client.on('error', () => {
        resolve(false);
      });

      client.on('timeout', () => {
        client.destroy();
        resolve(false);
      });

      client.connect(service.port, 'localhost');
    } else {
      const options = {
        hostname: 'localhost',
        port: service.port,
        path: service.path,
        method: 'GET',
        timeout: 2000,
      };

      const req = http.request(options, (res: IncomingMessage) => {
        resolve(res.statusCode !== undefined && res.statusCode < 500);
      });

      req.on('error', () => {
        resolve(false);
      });

      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.end();
    }
  });
}

async function waitForServices(): Promise<void> {
  console.log('[INFO] Waiting for services to be ready...\n');

  for (const service of services) {
    let retries = 0;
    let ready = false;

    while (retries < MAX_RETRIES && !ready) {
      ready = await checkService(service);

      if (ready) {
        console.log(`[OK] ${service.name} is ready on port ${service.port}`);
      } else {
        retries++;
        if (retries < MAX_RETRIES) {
          process.stdout.write(`[WAIT] Waiting for ${service.name}... (${retries}/${MAX_RETRIES})\r`);
          await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
        }
      }
    }

    if (!ready) {
      console.error(`\n[ERROR] ${service.name} failed to start after ${MAX_RETRIES} retries`);
      console.error('[TIP] Try running: docker compose logs ' + service.name.toLowerCase());
      process.exit(1);
    }
  }

  console.log('\n[SUCCESS] All services are ready!');
  console.log('\n[ACCESS] Access the application:');
  console.log('   Frontend:    http://localhost:3000');
  console.log('   Backend API: http://localhost:8000/api/v1');
  console.log('   Kong Admin:  http://localhost:8001');
  console.log('\n[CREDENTIALS] Test credentials:');
  console.log('   Username: ana     Password: demo123');
  console.log('   Username: carlos  Password: demo123');
  console.log('\n[DATABASES]');
  console.log('   atrio       - app/dev/seed      (DATABASE_URL)');
  console.log('   atrio_test  - integration tests (DATABASE_URL_TEST)');
  console.log('   If atrio_test is missing: npm run db:test:setup');
  console.log('\n[COMMANDS] Useful commands:');
  console.log('   npm run dev                 - Run frontend and backend locally');
  console.log('   npm run playwright:install  - Install Playwright Chromium');
  console.log('   npm run test:integration    - Backend integration tests');
  console.log('   npm run docker:logs         - View all container logs');
  console.log('   npm run docker:down         - Stop all containers');
}

waitForServices().catch((error) => {
  console.error('Error waiting for services:', error);
  process.exit(1);
});
