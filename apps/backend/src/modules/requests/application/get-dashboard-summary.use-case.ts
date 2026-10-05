import { Inject, Injectable } from '@nestjs/common';
import { RequestRepository } from '../domain/request-repository.port';
import { DashboardResponseDto } from '../presentation/dtos/dashboard-response.dto';

@Injectable()
export class GetDashboardSummaryUseCase {
  constructor(
    @Inject('REQUEST_REPOSITORY') private readonly repo: RequestRepository,
  ) {}

  async execute(): Promise<DashboardResponseDto> {
    return this.repo.getSummary();
  }
}