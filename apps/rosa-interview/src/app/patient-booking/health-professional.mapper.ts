import { Injectable } from '@nestjs/common';
import { Interval, Mapper } from '@rosa-interview/core';
import { HealthProfessionalModel } from './database';
import { HealthProfessionalEntity, Schedule } from './domain';
import { HealthProfessionalResponseDto, ScheduleDto, TimeRangeDto } from './dtos';

/**
 * Mapper constructs objects that are used in different layers:
 * Record is an object that is stored in a database,
 * Entity is an object that is used in application domain layer,
 * and a ResponseDTO is an object returned to a user (usually as json).
 */

@Injectable()
export class HealthProfessionalMapper
  implements
    Mapper<
      HealthProfessionalEntity,
      HealthProfessionalModel,
      HealthProfessionalResponseDto
    >
{
  toPersistence(entity: HealthProfessionalEntity): HealthProfessionalModel {
    const copy = entity.getProps();

    // TODO problem due to props
    const schedule: any = copy.schedule;

    return {
      _id: copy.id,
      createdAt: copy.createdAt,
      firstName: copy.firstName,
      lastName: copy.lastName,
      schedule: {
        weekDays: schedule.props.weekDays,
        timeRange: {
          end: schedule.props.timeRange.end.toJSDate(),
          start: schedule.props.timeRange.start.toJSDate(),
        },
        slotDuration: schedule.props.slotDuration,
      },
      timezone: copy.timezone,
      updatedAt: copy.updatedAt,
    };
  }

  toDomain(record: HealthProfessionalModel): HealthProfessionalEntity {
    const entity = new HealthProfessionalEntity({
      id: record._id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        firstName: record.firstName,
        lastName: record.lastName,
        schedule: new Schedule({
          weekDays: record.schedule.weekDays,
          timeRange: Interval.parse(
            record.schedule.timeRange.start,
            record.schedule.timeRange.end
          ),
          slotDuration: record.schedule.slotDuration,
        }),
        timezone: record.timezone,
      },
    });
    return entity;
  }

  toResponse(entity: HealthProfessionalEntity): HealthProfessionalResponseDto {
    const props = entity.getProps();
    const response = new HealthProfessionalResponseDto(entity);

    response.firstName = props.firstName;
    response.lastName = props.lastName;

    const scheduleDto = new ScheduleDto();

    const timeRangeDto = new TimeRangeDto();
    timeRangeDto.end = response.schedule.timeRange.end;
    timeRangeDto.start = response.schedule.timeRange.start;

    scheduleDto.weekDays = response.schedule.weekDays;
    scheduleDto.timeRange = timeRangeDto;
    scheduleDto.slotDuration = response.schedule.slotDuration;

    response.schedule = scheduleDto;
    response.timezone = props.timezone;

    return response;
  }

  /* ^ Data returned to the user is whitelisted to avoid leaks.
     If a new property is added, like password or a
     credit card number, it won't be returned
     unless you specifically allow this.
     (avoid blacklisting, which will return everything
      but blacklisted items, which can lead to a data leak).
  */
}
