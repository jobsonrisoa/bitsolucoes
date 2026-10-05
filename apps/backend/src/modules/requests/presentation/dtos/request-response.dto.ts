import { ApiProperty } from '@nestjs/swagger';
import { CategoryEnum } from '../../domain/category.value-object';
import { StatusEnum } from '../../domain/status.value-object';

export class RequestResponseDto {
  @ApiProperty({ example: 'SOL-000001' })
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ enum: CategoryEnum })
  category!: CategoryEnum;

  @ApiProperty({ enum: StatusEnum })
  status!: StatusEnum;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}