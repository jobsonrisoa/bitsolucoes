import Redis from 'ioredis';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { CachePort } from '../../../shared/cache.port';

@Injectable()
export class RedisCacheAdapter implements CachePort, OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheAdapter.name);
  private readonly client: Redis | null;

  constructor() {
    if (process.env.CACHE_ENABLED === 'false') {
      this.client = null;
      return;
    }

    this.client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
    });
    this.client.on('error', (error) => this.logCacheError('connection', undefined, error));
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.client) return;
    await this.client.quit().catch(() => undefined);
  }

  async get<T>(key: string): Promise<T | null> {
    return this.withFallback('get', key, null, async () => {
      const value = await this.client?.get(key);
      if (value == null) return null;
      return JSON.parse(value) as T;
    });
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.withFallback('set', key, undefined, async () => {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client?.set(key, serialized, 'EX', ttlSeconds);
      } else {
        await this.client?.set(key, serialized);
      }
    });
  }

  async del(key: string): Promise<void> {
    await this.withFallback('del', key, undefined, async () => {
      await this.client?.del(key);
    });
  }

  async increment(key: string): Promise<number> {
    return this.withFallback('increment', key, 0, async () => this.client?.incr(key) ?? 0);
  }

  private async withFallback<T>(
    operation: string,
    key: string | undefined,
    fallback: T,
    action: () => Promise<T>,
  ): Promise<T> {
    if (!this.client) return fallback;

    try {
      return await action();
    } catch (error) {
      this.logCacheError(operation, key, error);
      return fallback;
    }
  }

  private logCacheError(operation: string, key: string | undefined, error: unknown): void {
    this.logger.warn({
      event: 'cache.error',
      operation,
      key,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
