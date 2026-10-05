import { Inject, Injectable } from '@nestjs/common';
import { RequestRepository } from '../domain/request-repository.port';
import { RequestMapper } from '../infrastructure/request.mapper';
import { RequestResponseDto } from '../presentation/dtos/request-response.dto';
import { UpdateRequestDto } from '../presentation/dtos/update-request.dto';
import { Category, CategoryEnum } from '../domain/category.value-object';
import { NotFoundError } from '../../../shared/domain/domain-error';

@Injectable()
export class UpdateRequestUseCase {
  constructor(
    @Inject('REQUEST_REPOSITORY') private readonly repo: RequestRepository,
  ) {}

  async execute(id: string, dto: UpdateRequestDto): Promise<RequestResponseDto> {
    const numericId = BigInt(id.replace('SOL-', ''));
    const request = await this.repo.findById(numericId);
    if (!request) throw new NotFoundError(`Request ${id} not found`);

    const category = dto.category ? new Category(dto.category as CategoryEnum) : undefined;
    request.update(dto.title, dto.description, category);
    await this.repo.save(request);
    return RequestMapper.toResponse(request);
  }
}