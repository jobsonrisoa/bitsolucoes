import { ApiProperty } from '@nestjs/swagger';

export class DashboardResponseDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  open!: number;

  @ApiProperty()
  inProgress!: number;

  @ApiProperty()
  done!: number;
}