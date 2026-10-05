import { existsSync } from 'fs';
import { resolve } from 'path';

let loaded = false;

export function loadRootEnv(): void {
  if (loaded) return;

  const candidates = [
    resolve(process.cwd(), '../../.env'),
    resolve(process.cwd(), '.env'),
    resolve(__dirname, '../../.env'),
    resolve(__dirname, '../../../.env'),
    resolve(__dirname, '../../../../.env'),
  ];

  const loadEnvFile = (process as NodeJS.Process & { loadEnvFile?: (path?: string) => void }).loadEnvFile;

  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue;
    if (loadEnvFile) {
      loadEnvFile(candidate);
    }
    loaded = true;
    return;
  }

  loaded = true;
}

loadRootEnv();
