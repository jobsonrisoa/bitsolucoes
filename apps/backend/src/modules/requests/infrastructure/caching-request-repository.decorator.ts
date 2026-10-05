import { Injectable } from '@nestjs/common';
import { RequestRepository } from '../domain/request-repository.port';
import { Request } from '../domain/request.entity';
import { CachePort } from '../../../shared/cache.port';
import { ListFilters } from './request.repository';

const CACHE_TTL = 300;
const SUMMARY_KEY = 'dashboard:summary';
const requestKey = (id: bigint) => `request:${id.toString()}`;

@Injectable()
export class CachingRequestRepositoryDecorator implements RequestRepository {
  constructor(
    private readonly repo: RequestRepository,
    private readonly cache: CachePort,
  ) {}

  async save(req: Request): Promise<Request> {
    const saved = await this.repo.save(req);
    await this.cache.del(SUMMARY_KEY);
    await this.cache.del(requestKey(saved.id));
    return saved;
  }

  async findById(id: bigint): Promise<Request | null> {
    const cached = await this.cache.get<Request>(requestKey(id));
    if (cached) return cached;
    const result = await this.repo.findById(id);
    if (result) await this.cache.set(requestKey(id), result, CACHE_TTL);
    return result;
  }

  async delete(id: bigint): Promise<void> {
    await this.repo.delete(id);
    await this.cache.del(SUMMARY_KEY);
    await this.cache.del(requestKey(id));
  }

  async list(filters: ListFilters): Promise<{ data: Request[]; total: number }> {
    return this.repo.list(filters);
  }

  async getSummary(): Promise<{ total: number; open: number; inProgress: number; done: number }> {
    const cached = await this.cache.get<{ total: number; open: number; inProgress: number; done: number }>(SUMMARY_KEY);
    if (cached) return cached;
    const result = await this.repo.getSummary();
    await this.cache.set(SUMMARY_KEY, result, CACHE_TTL);
    return result;
  }
}