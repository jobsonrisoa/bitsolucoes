import { Inject, Injectable } from '@nestjs/common';
import { RequestRepository } from '../domain/request-repository.port';
import { RequestMapper } from '../infrastructure/request.mapper';
import { RequestResponseDto } from '../presentation/dtos/request-response.dto';
import { PaginatedResponseDto } from '../presentation/dtos/paginated-response.dto';
import { ListRequestsQueryDto } from '../presentation/dtos/list-requests-query.dto';
import { StatusEnum } from '../domain/status.value-object';
import { CategoryEnum } from '../domain/category.value-object';

@Injectable()
export class ListRequestsUseCase {
  constructor(
    @Inject('REQUEST_REPOSITORY') private readonly repo: RequestRepository,
  ) {}

  async execute(query: ListRequestsQueryDto): Promise<PaginatedResponseDto<RequestResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { data, total } = await this.repo.list({
      page,
      limit,
      status: query.status as StatusEnum | undefined,
      category: query.category as CategoryEnum | undefined,
      q: query.q,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    return {
      data: data.map(RequestMapper.toResponse),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
