import { Inject, Injectable } from '@nestjs/common';
import { RequestRepository } from '../domain/request-repository.port';
import { NotFoundError } from '../../../shared/domain/domain-error';

@Injectable()
export class DeleteRequestUseCase {
  constructor(
    @Inject('REQUEST_REPOSITORY') private readonly repo: RequestRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const numericId = BigInt(id.replace('SOL-', ''));
    const request = await this.repo.findById(numericId);
    if (!request) throw new NotFoundError(`Request ${id} not found`);
    request.ensureDeletable();
    await this.repo.delete(numericId);
  }
}