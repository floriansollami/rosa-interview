import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectCollection } from '@rosa-interview/core';
import * as mongo from 'mongodb';
import { Ok, Result } from 'oxide.ts';
import { HealthProfessionalScheduleModel } from '../../../database';
import { FindHealthProfessionalScheduleFirstAvailabilityQuery } from './find-health-professional-schedule-first-availability.query';

@QueryHandler(FindHealthProfessionalScheduleFirstAvailabilityQuery)
export class FindHealthProfessionalScheduleFirstAvailabilityQueryHandler
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
    query: FindHealthProfessionalScheduleFirstAvailabilityQuery
  ): Promise<
    Result<HealthProfessionalScheduleModel['availabilities'][0], Error>
  > {
    const { healthProfessionalId, from } = query;
    const pipeline = [
      {
        $match: {
          healthProfessionalId,
          startDate: { $gte: new Date(from) },
        },
      },
      { $unwind: '$availabilities' },
      {
        $match: {
          'availabilities.startTime': { $gte: new Date(from) },
        },
      },
      {
        $limit: 1,
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

    return Ok({
      endTime: document.availabilities[0].endTime,
      startTime: document.availabilities[0].startTime,
    });
  }
}
