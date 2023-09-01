import { Injectable } from '@nestjs/common';
import { DateTime, Interval, Mapper } from '@rosa-interview/core';
import TreeMap from 'ts-treemap';
import { HealthProfessionalScheduleModel } from './database';
import {
  Availability,
  HealthProfessionalScheduleEntity,
  ScheduledEvent,
} from './domain';

/**
 * Mapper constructs objects that are used in different layers:
 * Record is an object that is stored in a database,
 * Entity is an object that is used in application domain layer,
 * and a ResponseDTO is an object returned to a user (usually as json).
 */

@Injectable()
export class HealthProfessionalScheduleMapper
  implements
    Mapper<
      HealthProfessionalScheduleEntity,
      HealthProfessionalScheduleModel,
      any // HealthProfessionalScheduleResponseDto
    >
{
  toPersistence(
    entity: HealthProfessionalScheduleEntity
  ): HealthProfessionalScheduleModel {
    const copy = entity.getProps();

    return {
      _id: copy.id,
      availabilities: copy.availabilities.map((av) => ({
        endTime: av.unpack().endTime.toJSDate(),
        startTime: av.unpack().startTime.toJSDate(),
      })),
      createdAt: copy.createdAt,
      endDate: copy.period.end.toJSDate(),
      healthProfessionalId: copy.healthProfessionalId,
      scheduledEvents: Array.from(copy.scheduledEvents.values()).map((se) => ({
        endTime: se.unpack().period.start.toJSDate(),
        patientId: se.unpack().patientId,
        startTime: se.unpack().period.end.toJSDate(),
        status: se.unpack().status,
      })),
      startDate: copy.period.start.toJSDate(),
      timezone: copy.timezone,
      updatedAt: copy.updatedAt,
    };
  }

  toDomain(
    record: HealthProfessionalScheduleModel
  ): HealthProfessionalScheduleEntity {
    return new HealthProfessionalScheduleEntity({
      id: record._id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        availabilities: record.availabilities.map(
          (av) =>
            new Availability({
              endTime: DateTime.parseFromJSDate(av.endTime),
              startTime: DateTime.parseFromJSDate(av.startTime),
            })
        ),
        healthProfessionalId: record.healthProfessionalId,
        period: Interval.parseFromJSDate(record.startDate, record.endDate),
        scheduledEvents: TreeMap.fromMap(
          record.scheduledEvents.reduce(
            (map, event) =>
              map.set(
                event.startTime,
                new ScheduledEvent({
                  patientId: event.patientId,
                  period: Interval.parseFromJSDate(event.startTime, event.endTime),
                  status: event.status,
                })
              ),
            new Map<Date, ScheduledEvent>()
          )
        ),
        timezone: record.timezone,
      },
    });
  }

  toResponse(entity: HealthProfessionalScheduleEntity): any {
    return {};
  }

  /* ^ Data returned to the user is whitelisted to avoid leaks.
     If a new property is added, like password or a
     credit card number, it won't be returned
     unless you specifically allow this.
     (avoid blacklisting, which will return everything
      but blacklisted items, which can lead to a data leak).
  */
}
