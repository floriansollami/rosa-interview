import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateID, Interval, NotFoundException } from '@rosa-interview/core';
import { Err, Ok, Result } from 'oxide.ts';
import TreeMap from 'ts-treemap';
import {
  HEALTH_PROFESSIONAL_REPOSITORY,
  HEALTH_PROFESSIONAL_SCHEDULE_REPOSITORY,
  HealthProfessionalRepositoryPort,
  HealthProfessionalScheduleRepositoryPort,
} from '../../../database';
import {
  HealthProfessionalScheduleEntity,
  ScheduledEvent,
} from '../../../domain';
import { Create14DaysScheduleCommand } from './create-14-days-schedule.command';

@CommandHandler(Create14DaysScheduleCommand)
export class Create14DaysScheduleService implements ICommandHandler {
  constructor(
    @Inject(HEALTH_PROFESSIONAL_REPOSITORY)
    protected readonly healthProfessionalRepository: HealthProfessionalRepositoryPort,
    @Inject(HEALTH_PROFESSIONAL_SCHEDULE_REPOSITORY)
    protected readonly healthProfessionalScheduleRepository: HealthProfessionalScheduleRepositoryPort
  ) {}

  /**
   * Let's suppose, non-appointment events of the health professional come from an external system (his calendar ?).
   *
   * This method will create a new schedule for a health professional for a period of 14 days and calculate
   * the availabilities.
   *
   * Of course, we will have to add a command to book an event and update the availabilities (in O(1) if possible).
   */
  async execute(
    command: Create14DaysScheduleCommand
  ): Promise<Result<AggregateID, NotFoundException>> {
    const found = await this.healthProfessionalRepository.findOneById(
      command.healthProfessionalId
    );

    if (found.isNone()) {
      return Err(new NotFoundException());
    }

    const hp = found.unwrap();
    const hps: any =
      HealthProfessionalScheduleEntity.createWithoutAvailabilities({
        healthProfessionalId: hp.id,
        period: Interval.parseFromJSDate(
          new Date(command.startDate),
          new Date(command.endDate)
        ),
        scheduledEvents: TreeMap.fromMap(
          command.events.reduce(
            (map, event) =>
              map.set(
                new Date(event.startTime),
                ScheduledEvent.createFromPartialProps({
                  period: Interval.parseFromJSDate(
                    new Date(event.startTime),
                    new Date(event.endTime)
                  ),
                })
              ),
            new Map<Date, ScheduledEvent>()
          )
        ),
        timezone: hp.timezone,
      });

    hps.generateAvailabilities(hp);

    console.log({
      availabilities: hps.props.availabilities.map((av: any) => ({
        endTime: av.props.endTime.toTZ().toFormat(),
        startTime: av.props.startTime.toTZ().toFormat(),
      })),
    });

    await this.healthProfessionalScheduleRepository.insert(hps);

    return Ok(hps.id);
  }
}
