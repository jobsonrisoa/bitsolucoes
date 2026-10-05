import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, MaxLength, MinLength } from 'class-validator';
import { CategoryEnum } from '../../domain/category.value-object';

export class UpdateRequestDto {
  @ApiPropertyOptional({ description: 'Title of the request', minLength: 3, maxLength: 120 })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional({ description: 'Detailed description', minLength: 10, maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ enum: CategoryEnum })
  @IsOptional()
  @IsEnum(CategoryEnum)
  category?: CategoryEnum;
}