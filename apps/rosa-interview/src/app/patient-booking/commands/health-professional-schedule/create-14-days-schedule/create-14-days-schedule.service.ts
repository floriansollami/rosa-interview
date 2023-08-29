import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateID, Interval, NotFoundException } from '@rosa-interview/core';
import { Err, Ok, Result } from 'oxide.ts';
import TreeMap from 'ts-treemap';
import {
  HEALTH_PROFESSIONAL_REPOSITORY,
  HEALTH_PROFESSIONAL_SCHEDULE_REPOSITORY,
  HealthProfessionalRepositoryPort,
} from '../../../database';
import { HealthProfessionalScheduleRepositoryPort } from '../../../database/health-professional-schedule/health-professional-schedule.repository.port';
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

  //
  // un cron va creer un schedule de 15 jours, le jour avant la fin des 14 jours a partir du schedule du docteur
  // quand on cree le schedule, on calcule les availabilities initiales a partir du schedule du docteur
  // je pars du principe que le docteur n'ajoute pas des evenements dans un quinzaine en cours!

  // faire un autre use case book an evenement, ce qui va adapter les availabilities
  // et en O(1) grace a une cle de hachage je saurais a quel index je dois l'ajouter
  //

  /**
   * Let's suppose, non-appointment events of the health professional come from an external system (his calendar ?).
   *
   * @param command
   * @returns
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
    const hps = HealthProfessionalScheduleEntity.createWithoutAvailabilities({
      healthProfessionalId: hp.id,
      period: Interval.parse(
        new Date(command.startDate),
        new Date(command.endDate)
      ),
      scheduledEvents: TreeMap.fromMap(
        command.events.reduce(
          (map, event) =>
            map.set(
              new Date(event.startTime),
              ScheduledEvent.createFromPartialProps({
                period: Interval.parse(
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

    await this.healthProfessionalScheduleRepository.insert(hps);

    return Ok(hps.id);
  }
}
