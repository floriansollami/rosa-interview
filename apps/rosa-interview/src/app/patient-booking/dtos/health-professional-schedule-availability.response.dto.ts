import { ApiProperty } from '@nestjs/swagger';

export class HealthProfessionalScheduleAvailabilityResponseDto {
  @ApiProperty({
    example: '2023-08-28T12:00:00.000Z',
    description: 'End time of the availability',
  })
  endTime!: Date;

  @ApiProperty({
    example: '2023-08-28T09:30:00.000Z',
    description: 'Start time of the availability',
  })
  startTime!: Date;

  constructor(props: HealthProfessionalScheduleAvailabilityResponseDto) {
    this.endTime = props.endTime;
    this.startTime = props.startTime;
  }
}
