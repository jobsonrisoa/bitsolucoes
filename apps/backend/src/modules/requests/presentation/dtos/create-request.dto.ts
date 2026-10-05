import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, MaxLength, MinLength } from 'class-validator';
import { CategoryEnum } from '../../domain/category.value-object';

export class CreateRequestDto {
  @ApiProperty({ description: 'Title of the request', minLength: 3, maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(120)
  title!: string;

  @ApiProperty({ description: 'Detailed description', minLength: 10, maxLength: 2000 })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  description!: string;

  @ApiProperty({ enum: CategoryEnum })
  @IsEnum(CategoryEnum)
  @IsNotEmpty()
  category!: CategoryEnum;
}