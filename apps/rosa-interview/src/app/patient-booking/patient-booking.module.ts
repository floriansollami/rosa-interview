import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreModule } from '@rosa-interview/core';
import {
  Create14DaysScheduleService,
  CreateHealthProfessionalController,
  CreateHealthProfessionalService,
} from './commands';
import {
  HEALTH_PROFESSIONAL_REPOSITORY,
  HEALTH_PROFESSIONAL_SCHEDULE_REPOSITORY,
  HealthProfessionalRepository,
  HealthProfessionalScheduleRepository,
} from './database';
import { HealthProfessionalScheduleMapper } from './health-professional-schedule.mapper';
import { HealthProfessionalMapper } from './health-professional.mapper';
import {
  FindHealthProfessionalScheduleAvailabilitiesHttpController,
  FindHealthProfessionalScheduleAvailabilitiesQueryHandler,
  FindHealthProfessionalScheduleFirstAvailabilityHttpController,
  FindHealthProfessionalScheduleFirstAvailabilityQueryHandler,
} from './queries';

const httpControllers = [
  CreateHealthProfessionalController,
  FindHealthProfessionalScheduleAvailabilitiesHttpController,
  FindHealthProfessionalScheduleFirstAvailabilityHttpController,
];
const commandHandlers: Provider[] = [
  CreateHealthProfessionalService,
  Create14DaysScheduleService,
];
const queryHandlers: Provider[] = [
  FindHealthProfessionalScheduleAvailabilitiesQueryHandler,
  FindHealthProfessionalScheduleFirstAvailabilityQueryHandler,
];
const mappers: Provider[] = [
  HealthProfessionalMapper,
  HealthProfessionalScheduleMapper,
];
const repositories: Provider[] = [
  {
    provide: HEALTH_PROFESSIONAL_REPOSITORY,
    useClass: HealthProfessionalRepository,
  },
  {
    provide: HEALTH_PROFESSIONAL_SCHEDULE_REPOSITORY,
    useClass: HealthProfessionalScheduleRepository,
  },
];

@Module({
  imports: [
    CoreModule.forFeature([
      'health_professionals',
      'health_professional_schedules',
    ]),
    CqrsModule,
  ],
  controllers: [...httpControllers],
  providers: [
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class PatientBookingModule {}
