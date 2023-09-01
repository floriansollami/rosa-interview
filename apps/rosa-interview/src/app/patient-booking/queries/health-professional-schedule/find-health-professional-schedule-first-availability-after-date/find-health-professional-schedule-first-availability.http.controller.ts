import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  Query,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotFoundException } from '@rosa-interview/core';
import { Result, match } from 'oxide.ts';
import { HealthProfessionalScheduleModel } from '../../../database';
import { HealthProfessionalScheduleAvailabilityResponseDto } from '../../../dtos';
import { FindHealthProfessionalScheduleFirstAvailabilityQuery } from './find-health-professional-schedule-first-availability.query';
import { FindHealthProfessionalScheduleFirstAvailabilityQueryRequestDto } from './find-health-professional-schedule-first-availability.request.dto';
import { Availability } from '../../../domain';

// One controller per use case is considered a good practice
@Controller('health-professionals')
export class FindHealthProfessionalScheduleFirstAvailabilityHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':healthProfessionalId/schedule/first-availability')
  @ApiOperation({
    summary:
      'Find first schedule availability for a health professional for a given date',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: HealthProfessionalScheduleAvailabilityResponseDto,
  })
  async findHealthProfessionalScheduleFirstAvailability(
    @Param('healthProfessionalId') healthProfessionalId: string,
    @Query()
    queryParams: FindHealthProfessionalScheduleFirstAvailabilityQueryRequestDto
  ): Promise<HealthProfessionalScheduleAvailabilityResponseDto> {
    const query = new FindHealthProfessionalScheduleFirstAvailabilityQuery({
      healthProfessionalId,
      from: queryParams.from,
    });

    const result: Result<
      HealthProfessionalScheduleModel['availabilities'][0],
      Error
    > = await this.queryBus.execute(query);

    // Whitelisting returned properties
    return match(result, {
      Ok: (
        availability: HealthProfessionalScheduleModel['availabilities'][0]
      ) =>
        new HealthProfessionalScheduleAvailabilityResponseDto({
          endTime: availability.endTime,
          startTime: availability.startTime,
        }),
      Err: (error: Error) => {
        if (error instanceof NotFoundException)
          throw new NotFoundHttpException(error.message);
        throw error;
      },
    });
  }
}
