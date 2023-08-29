import { Injectable } from '@nestjs/common';
import { InjectPapr, MongoRepositoryBase } from '@rosa-interview/core';
import Papr, { schema, types } from 'papr';
import { HealthProfessionalEntity } from '../../domain';
import { HealthProfessionalMapper } from '../../health-professional.mapper';
import { HealthProfessionalRepositoryPort } from './health-professional.repository.port';

export const HEALTH_PROFESSIONAL_REPOSITORY = Symbol(
  'HEALTH_PROFESSIONAL_REPOSITORY'
);

const healthProfessionalSchema = schema({
  _id: types.string({ required: true }),
  createdAt: types.date({ required: true }),
  firstName: types.string({ required: true }),
  lastName: types.string({ required: true }),
  schedule: types.object(
    {
      weekDays: types.array(types.number(), {
        maxItems: 7,
        minItems: 0,
        required: true,
        uniqueItems: true,
      }),
      timeRange: types.object(
        {
          end: types.date({ required: true }),
          start: types.date({ required: true }),
        },
        { required: true }
      ),
      slotDuration: types.string({ required: true }),
    },
    { required: true }
  ),
  timezone: types.string({ required: true }),
  updatedAt: types.date({ required: true }),
});

export type HealthProfessionalModel = (typeof healthProfessionalSchema)[0];

@Injectable()
export class HealthProfessionalRepository
  extends MongoRepositoryBase<HealthProfessionalEntity, HealthProfessionalModel>
  implements HealthProfessionalRepositoryPort
{
  constructor(@InjectPapr() papr: Papr, mapper: HealthProfessionalMapper) {
    super(papr.model('health_professionals', healthProfessionalSchema), mapper);
  }
}
