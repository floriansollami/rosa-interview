import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from '@rosa-interview/core';

export class TimeRangeDto {
  @ApiProperty({
    example: '08:00',
    description: 'Start time',
    type: String,
  })
  start!: string;

  @ApiProperty({
    example: '17:00',
    description: 'End time',
    type: String,
  })
  end!: string;
}

export class ScheduleDto {
  @ApiProperty({
    example: ['Monday', 'Wednesday'],
    description: 'Days of the week',
    isArray: true,
    type: String,
  })
  weekDays!: string[];

  @ApiProperty({
    type: TimeRangeDto,
    description: 'Time range for the schedule',
  })
  timeRange!: TimeRangeDto;

  @ApiProperty({
    example: 30,
    description: 'Duration of each slot in minutes',
    type: Number,
  })
  slotDuration!: number;
}

export class HealthProfessionalResponseDto extends ResponseBase {
  @ApiProperty({
    example: 'John',
    description: "User's first name",
    type: String,
  })
  firstName!: string;

  @ApiProperty({
    example: 'Doe',
    description: "User's last name",
    type: String,
  })
  lastName!: string;

  @ApiProperty({
    type: ScheduleDto,
    description: 'Schedule details',
  })
  schedule!: ScheduleDto;

  @ApiProperty({
    example: 'Europe/Brussels',
    description: "HP's timezone",
    type: String,
  })
  timezone!: string;
}
