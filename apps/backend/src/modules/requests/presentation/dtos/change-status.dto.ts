import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusEnum } from '../../domain/status.value-object';

export class ChangeStatusDto {
  @ApiProperty({ enum: StatusEnum })
  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status!: StatusEnum;
}