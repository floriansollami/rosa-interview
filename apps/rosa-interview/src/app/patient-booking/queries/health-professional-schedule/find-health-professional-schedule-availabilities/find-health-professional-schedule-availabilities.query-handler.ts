import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectCollection, NotFoundException } from '@rosa-interview/core';
import * as mongo from 'mongodb';
import { Err, Ok, Result } from 'oxide.ts';
import { HealthProfessionalScheduleModel } from '../../../database/health-professional-schedule';
import { FindHealthProfessionalScheduleAvailabilitiesQuery } from './find-health-professional-schedule-availabilities.query';

@QueryHandler(FindHealthProfessionalScheduleAvailabilitiesQuery)
export class FindHealthProfessionalScheduleAvailabilitiesQueryHandler
  implements IQueryHandler
{
  // TODO would be better to inject papr model instead, to have strong typing
  // but we would need to change Mongo custom dynamic module to be able to
  // use glob feature to access model schema of each entity file
  constructor(
    @InjectCollection('HEALTH_PROFESSIONAL_SCHEDULES')
    private readonly healthProfessionalScheduleCollection: mongo.Collection
  ) {}

  /**
   * In read model we don't need to execute
   * any business logic, so we can bypass
   * domain and repository layers completely
   * and execute query directly
   */
  async execute(
    query: FindHealthProfessionalScheduleAvailabilitiesQuery
  ): Promise<Result<HealthProfessionalScheduleModel['availabilities'], Error>> {
    const { healthProfessionalId, from, to } = query;
    const pipeline = [
      {
        $match: {
          healthProfessionalId,
          startDate: { $lte: new Date(from) },
          endDate: { $gte: new Date(to) },
        },
      },
      { $unwind: '$availabilities' },
      {
        $match: {
          'availabilities.startTime': {
            $gte: new Date(from),
            $lt: new Date(to),
          },
          'availabilities.endTime': { $gt: new Date(from), $lte: new Date(to) },
        },
      },
      {
        $group: {
          _id: '$healthProfessionalId',
          availabilities: { $push: '$availabilities' },
        },
      },
    ];

    const [document] = await this.healthProfessionalScheduleCollection
      .aggregate<Pick<HealthProfessionalScheduleModel, 'availabilities'>>(
        pipeline
      )
      .toArray();

    if (!document) {
      return Err(new NotFoundException());
    }

    return Ok(
      document.availabilities.map((av) => ({
        endTime: av.endTime,
        startTime: av.startTime,
      }))
    );
  }
}
