import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Result } from 'oxide.ts';
import { HealthProfessionalScheduleModel } from '../../../database/health-professional-schedule';
import { HealthProfessionalScheduleAvailabilitiesResponseDto } from '../../../dtos';
import { FindHealthProfessionalScheduleAvailabilitiesQuery } from './find-health-professional-schedule-availabilities.query';
import { FindHealthProfessionalScheduleAvailabilitiesQueryRequestDto } from './find-health-professional-schedule-availabilities.request.dto';

// One controller per use case is considered a good practice
@Controller('health-professionals')
export class FindHealthProfessionalScheduleAvailabilitiesHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':healthProfessionalId/schedule/availabilities')
  @ApiOperation({
    summary:
      'Find schedule availabilities for a health professional for a given date range',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: HealthProfessionalScheduleAvailabilitiesResponseDto,
  })
  async findHealthProfessionalScheduleAvailabilities(
    @Param('healthProfessionalId') healthProfessionalId: string,
    @Query()
    queryParams: FindHealthProfessionalScheduleAvailabilitiesQueryRequestDto
  ): Promise<HealthProfessionalScheduleAvailabilitiesResponseDto> {
    const query = new FindHealthProfessionalScheduleAvailabilitiesQuery({
      healthProfessionalId,
      from: queryParams.from,
      to: queryParams.to,
      limit: queryParams?.limit,
      page: queryParams?.page,
    });

    const result: Result<
      HealthProfessionalScheduleModel['availabilities'],
      Error
    > = await this.queryBus.execute(query);

    // Whitelisting returned properties
    return new HealthProfessionalScheduleAvailabilitiesResponseDto({
      availabilities: result.unwrap(),
    });
  }
}
