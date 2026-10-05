import { Inject, Injectable } from '@nestjs/common';
import { RequestRepository } from '../domain/request-repository.port';
import { RequestMapper } from '../infrastructure/request.mapper';
import { RequestResponseDto } from '../presentation/dtos/request-response.dto';
import { NotFoundError } from '../../../shared/domain/domain-error';

@Injectable()
export class GetRequestUseCase {
  constructor(
    @Inject('REQUEST_REPOSITORY') private readonly repo: RequestRepository,
  ) {}

  async execute(id: string): Promise<RequestResponseDto> {
    const numericId = BigInt(id.replace('SOL-', ''));
    const request = await this.repo.findById(numericId);
    if (!request) throw new NotFoundError(`Request ${id} not found`);
    return RequestMapper.toResponse(request);
  }
}