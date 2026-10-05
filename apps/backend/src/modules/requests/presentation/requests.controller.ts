import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, Request, HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiCookieAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/presentation/auth.guard';
import { CreateRequestDto } from './dtos/create-request.dto';
import { UpdateRequestDto } from './dtos/update-request.dto';
import { ChangeStatusDto } from './dtos/change-status.dto';
import { RequestResponseDto } from './dtos/request-response.dto';
import { ListRequestsQueryDto } from './dtos/list-requests-query.dto';
import { PaginatedResponseDto } from './dtos/paginated-response.dto';
import { CreateRequestUseCase } from '../application/create-request.use-case';
import { ListRequestsUseCase } from '../application/list-requests.use-case';
import { GetRequestUseCase } from '../application/get-request.use-case';
import { UpdateRequestUseCase } from '../application/update-request.use-case';
import { DeleteRequestUseCase } from '../application/delete-request.use-case';
import { ChangeRequestStatusUseCase } from '../application/change-request-status.use-case';

@ApiTags('Requests')
@ApiCookieAuth('session')
@UseGuards(AuthGuard)
@Controller('requests')
export class RequestsController {
  constructor(
    private readonly createUseCase: CreateRequestUseCase,
    private readonly listUseCase: ListRequestsUseCase,
    private readonly getUseCase: GetRequestUseCase,
    private readonly updateUseCase: UpdateRequestUseCase,
    private readonly deleteUseCase: DeleteRequestUseCase,
    private readonly changeStatusUseCase: ChangeRequestStatusUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List requests with pagination and filters' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  list(@Query() query: ListRequestsQueryDto): Promise<PaginatedResponseDto<RequestResponseDto>> {
    return this.listUseCase.execute(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new request' })
  @ApiResponse({ status: 201, type: RequestResponseDto })
  create(@Body() body: CreateRequestDto, @Request() req: any): Promise<RequestResponseDto> {
    const requesterId: number = req.user?.sub ?? 1;
    return this.createUseCase.execute(body, requesterId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get request by id' })
  @ApiParam({ name: 'id', example: 'SOL-000001' })
  @ApiResponse({ status: 200, type: RequestResponseDto })
  @ApiResponse({ status: 404, description: 'Not found' })
  get(@Param('id') id: string): Promise<RequestResponseDto> {
    return this.getUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an open request' })
  @ApiParam({ name: 'id', example: 'SOL-000001' })
  @ApiResponse({ status: 200, type: RequestResponseDto })
  @ApiResponse({ status: 409, description: 'Request not editable' })
  update(@Param('id') id: string, @Body() body: UpdateRequestDto): Promise<RequestResponseDto> {
    return this.updateUseCase.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete an open request' })
  @ApiParam({ name: 'id', example: 'SOL-000001' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 409, description: 'Request not deletable' })
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.deleteUseCase.execute(id);
    return { success: true };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Change request status' })
  @ApiParam({ name: 'id', example: 'SOL-000001' })
  @ApiResponse({ status: 200, type: RequestResponseDto })
  @ApiResponse({ status: 409, description: 'Invalid status transition' })
  changeStatus(@Param('id') id: string, @Body() body: ChangeStatusDto): Promise<RequestResponseDto> {
    return this.changeStatusUseCase.execute(id, body);
  }
}
