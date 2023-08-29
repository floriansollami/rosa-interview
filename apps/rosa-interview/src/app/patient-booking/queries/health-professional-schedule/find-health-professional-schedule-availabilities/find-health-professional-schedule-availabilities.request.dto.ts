import { ApiProperty } from '@nestjs/swagger';
import { PaginatedQueryRequestDto } from '@rosa-interview/core';
import { IsDefined, IsISO8601, IsString } from 'class-validator';

export class FindHealthProfessionalScheduleAvailabilitiesQueryRequestDto extends PaginatedQueryRequestDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsISO8601()
  readonly from!: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsISO8601()
  readonly to!: string;
}
