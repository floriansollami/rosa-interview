import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateID, ConflictException, Interval } from '@rosa-interview/core';
import { Err, Ok, Result } from 'oxide.ts';
import {
  HEALTH_PROFESSIONAL_REPOSITORY,
  HealthProfessionalRepositoryPort,
} from '../../../database';
import {
  HealthProfessionalAlreadyExistsError,
  HealthProfessionalEntity,
  Schedule
} from '../../../domain';
import { CreateHealthProfessionalCommand } from './create-health-professional.command';

@CommandHandler(CreateHealthProfessionalCommand)
export class CreateHealthProfessionalService implements ICommandHandler {
  constructor(
    @Inject(HEALTH_PROFESSIONAL_REPOSITORY)
    protected readonly healthProfessionalRepository: HealthProfessionalRepositoryPort
  ) {}

  async execute(
    command: CreateHealthProfessionalCommand
  ): Promise<Result<AggregateID, HealthProfessionalAlreadyExistsError>> {
    const hp = HealthProfessionalEntity.create({
      firstName: command.firstName,
      lastName: command.lastName,
      schedule: new Schedule({
        weekDays: command.schedule.weekDays,
        timeRange: Interval.parse(
          new Date(`2000-01-01T${command.schedule.timeRange.start}:00`),
          new Date(`2000-01-01T${command.schedule.timeRange.end}:00`)
        ),
        slotDuration: command.schedule.slotDuration,
      }),
      timezone: command.timezone,
    });

    // console.log(hp);

    try {
      await this.healthProfessionalRepository.insert(hp);

      return Ok(hp.id);
    } catch (error) {
      if (error instanceof ConflictException) {
        return Err(new HealthProfessionalAlreadyExistsError(error));
      }

      throw error;
    }
  }
}
