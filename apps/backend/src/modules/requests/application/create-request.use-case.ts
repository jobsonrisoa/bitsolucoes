import { Inject, Injectable } from '@nestjs/common';
import { RequestRepository } from '../domain/request-repository.port';
import { Request } from '../domain/request.entity';
import { Category } from '../domain/category.value-object';
import { Status, StatusEnum } from '../domain/status.value-object';
import { RequestMapper } from '../infrastructure/request.mapper';
import { RequestResponseDto } from '../presentation/dtos/request-response.dto';
import { CreateRequestDto } from '../presentation/dtos/create-request.dto';
import { Clock } from '../../../shared/clock';

@Injectable()
export class CreateRequestUseCase {
  constructor(
    @Inject('REQUEST_REPOSITORY') private readonly repo: RequestRepository,
  ) {}

  async execute(dto: CreateRequestDto, requesterId: number): Promise<RequestResponseDto> {
    const request = new Request(
      0n,
      dto.title,
      dto.description,
      new Category(dto.category),
      new Status(StatusEnum.OPEN),
      requesterId,
      Clock.now(),
      Clock.now(),
    );
    const saved = await this.repo.save(request);
    return RequestMapper.toResponse(saved);
  }
}