import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601Duration, IsTimezone } from '@rosa-interview/core';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsIn,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

export class CreateHealthProfessionalScheduleTimeRangeDto {
  @ApiProperty({
    description: 'End time of the schedule in HH:mm format',
    example: '17:30',
  })
  @IsDefined()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Hours must be in the format HH:mm',
  })
  readonly end!: string;

  @ApiProperty({
    description: 'Start time of the schedule in HH:mm format',
    example: '09:00',
  })
  @IsDefined()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Hours must be in the format HH:mm',
  })
  readonly start!: string;
}

export class CreateHealthProfessionalScheduleDto {
  @ApiProperty({
    description:
      'Array of weekdays represented as numbers (1 for Monday, 7 for Sunday)',
    type: 'number',
    isArray: true,
    example: [1, 2, 3],
  })
  @IsDefined()
  @IsArray()
  @IsIn([1, 2, 3, 4, 5, 6, 7], { each: true })
  readonly weekDays!: number[];

  @ApiProperty({
    description: 'Time range for the schedule',
    type: () => CreateHealthProfessionalScheduleTimeRangeDto,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateHealthProfessionalScheduleTimeRangeDto)
  readonly timeRange!: CreateHealthProfessionalScheduleTimeRangeDto;

  @ApiProperty({
    description: 'Duration of each slot in ISO 8601 duration format',
    example: 'PT30M',
  })
  @IsDefined()
  @IsString()
  @IsISO8601Duration()
  readonly slotDuration!: string;
}

export class CreateHealthProfessionalRequestDto {
  @ApiProperty({
    description: 'First name of the health professional',
    example: 'John',
  })
  @IsDefined()
  @IsString()
  readonly firstName!: string;

  @ApiProperty({
    description: 'Last name of the health professional',
    example: 'Doe',
  })
  @IsDefined()
  @IsString()
  readonly lastName!: string;

  @ApiProperty({
    description: 'Schedule details for the health professional',
    type: () => CreateHealthProfessionalScheduleDto,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateHealthProfessionalScheduleDto)
  readonly schedule!: CreateHealthProfessionalScheduleDto;

  @ApiProperty({
    description: 'IANA time zone for the health professional',
    example: 'Europe/Brussels',
  })
  @IsDefined()
  @IsString()
  @IsTimezone()
  readonly timezone!: string;
}
