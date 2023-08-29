import { Injectable } from '@nestjs/common';
import { InjectPapr, MongoRepositoryBase } from '@rosa-interview/core';
import Papr, { schema, types } from 'papr';
import { HealthProfessionalScheduleEntity, Status } from '../../domain';
import { HealthProfessionalScheduleMapper } from '../../health-professional-schedule.mapper';
import { HealthProfessionalScheduleRepositoryPort } from './health-professional-schedule.repository.port';

export const HEALTH_PROFESSIONAL_SCHEDULE_REPOSITORY = Symbol(
  'HEALTH_PROFESSIONAL_SCHEDULE_REPOSITORY'
);

const healthProfessionalScheduleSchema = schema({
  _id: types.string({ required: true }),
  availabilities: types.array(
    types.object({
      endTime: types.date({ required: true }),
      startTime: types.date({ required: true }),
    }),
    { required: true }
  ),
  createdAt: types.date({ required: true }),
  endDate: types.date({ required: true }),
  healthProfessionalId: types.string({ required: true }),
  scheduledEvents: types.array(
    types.object({
      endTime: types.date({ required: true }),

      /**
       * Usage of null as a value in Mongo is discouraged,
       * as it makes some common query patterns ambiguous:
       * find({ myField: null }) will match documents that
       * have the myField value set to the literal null or
       * that match { myField: { $exists: false } }.
       */
      patientId: types.string({ required: false }),
      startTime: types.date({ required: true }),
      status: types.enum(Object.values(Status), { required: true }),
    }),
    { required: true }
  ),
  startDate: types.date({ required: true }),
  timezone: types.string({ required: true }),
  updatedAt: types.date({ required: true }),
});

export type HealthProfessionalScheduleModel =
  (typeof healthProfessionalScheduleSchema)[0];

@Injectable()
export class HealthProfessionalScheduleRepository
  extends MongoRepositoryBase<
    HealthProfessionalScheduleEntity,
    HealthProfessionalScheduleModel
  >
  implements HealthProfessionalScheduleRepositoryPort
{
  constructor(
    @InjectPapr() papr: Papr,
    mapper: HealthProfessionalScheduleMapper
  ) {
    super(
      papr.model(
        'health_professional_schedules',
        healthProfessionalScheduleSchema
      ),
      mapper
    );
  }
}
