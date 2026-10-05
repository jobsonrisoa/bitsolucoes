import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusEnum } from '../../domain/status.value-object';
import { CategoryEnum } from '../../domain/category.value-object';

export class ListRequestsQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ description: 'Search term' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: CategoryEnum })
  @IsOptional()
  @IsEnum(CategoryEnum)
  category?: CategoryEnum;

  @ApiPropertyOptional({ enum: StatusEnum })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @ApiPropertyOptional({ enum: ['id', 'title', 'category', 'requesterId', 'createdAt', 'status'] })
  @IsOptional()
  @IsIn(['id', 'title', 'category', 'requesterId', 'createdAt', 'status'])
  sortBy?: 'id' | 'title' | 'category' | 'requesterId' | 'createdAt' | 'status';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
