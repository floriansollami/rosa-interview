import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsISO8601, IsString } from 'class-validator';

export class FindHealthProfessionalScheduleFirstAvailabilityQueryRequestDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsISO8601()
  readonly from!: string;
}
