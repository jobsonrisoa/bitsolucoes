import { Inject, Injectable } from '@nestjs/common';
import { RequestRepository } from '../domain/request-repository.port';
import { RequestMapper } from '../infrastructure/request.mapper';
import { RequestResponseDto } from '../presentation/dtos/request-response.dto';
import { ChangeStatusDto } from '../presentation/dtos/change-status.dto';
import { NotFoundError } from '../../../shared/domain/domain-error';

@Injectable()
export class ChangeRequestStatusUseCase {
  constructor(
    @Inject('REQUEST_REPOSITORY') private readonly repo: RequestRepository,
  ) {}

  async execute(id: string, dto: ChangeStatusDto): Promise<RequestResponseDto> {
    const numericId = BigInt(id.replace('SOL-', ''));
    const request = await this.repo.findById(numericId);
    if (!request) throw new NotFoundError(`Request ${id} not found`);
    request.changeStatus(dto.status);
    await this.repo.save(request);
    return RequestMapper.toResponse(request);
  }
}