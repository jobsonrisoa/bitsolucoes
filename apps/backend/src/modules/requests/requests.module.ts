import { Module } from '@nestjs/common';
import { RequestsController } from './presentation/requests.controller';
import { DashboardController } from './presentation/dashboard.controller';
import { PrismaRequestRepository } from './infrastructure/request.repository';
import { RedisCacheAdapter } from './infrastructure/redis-cache.adapter';
import { CachingRequestRepositoryDecorator } from './infrastructure/caching-request-repository.decorator';
import { CreateRequestUseCase } from './application/create-request.use-case';
import { ListRequestsUseCase } from './application/list-requests.use-case';
import { GetRequestUseCase } from './application/get-request.use-case';
import { UpdateRequestUseCase } from './application/update-request.use-case';
import { DeleteRequestUseCase } from './application/delete-request.use-case';
import { ChangeRequestStatusUseCase } from './application/change-request-status.use-case';
import { GetDashboardSummaryUseCase } from './application/get-dashboard-summary.use-case';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RequestsController, DashboardController],
  providers: [
    PrismaRequestRepository,
    RedisCacheAdapter,
    {
      provide: 'REQUEST_REPOSITORY',
      useFactory: (repo: PrismaRequestRepository, cache: RedisCacheAdapter) =>
        new CachingRequestRepositoryDecorator(repo, cache),
      inject: [PrismaRequestRepository, RedisCacheAdapter],
    },
    CreateRequestUseCase,
    ListRequestsUseCase,
    GetRequestUseCase,
    UpdateRequestUseCase,
    DeleteRequestUseCase,
    ChangeRequestStatusUseCase,
    GetDashboardSummaryUseCase,
  ],
})
export class RequestsModule {}
