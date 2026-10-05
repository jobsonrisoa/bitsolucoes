import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/presentation/auth.guard';
import { GetDashboardSummaryUseCase } from '../application/get-dashboard-summary.use-case';
import { DashboardResponseDto } from './dtos/dashboard-response.dto';

@ApiTags('Dashboard')
@ApiCookieAuth('session')
@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly summaryUseCase: GetDashboardSummaryUseCase) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get dashboard summary counts' })
  @ApiResponse({ status: 200, type: DashboardResponseDto })
  getSummary(): Promise<DashboardResponseDto> {
    return this.summaryUseCase.execute();
  }
}