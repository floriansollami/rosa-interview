import { Test, TestingModule } from '@nestjs/testing';
import { Interval } from '@rosa-interview/core';
import { Some } from 'oxide.ts';
import {
  HEALTH_PROFESSIONAL_REPOSITORY,
  HEALTH_PROFESSIONAL_SCHEDULE_REPOSITORY,
  HealthProfessionalRepositoryPort,
  HealthProfessionalScheduleRepositoryPort,
} from '../../../database';
import { HealthProfessionalEntity, Schedule } from '../../../domain';
import { Create14DaysScheduleCommand } from './create-14-days-schedule.command';
import { Create14DaysScheduleService } from './create-14-days-schedule.service';

describe('Create14DaysScheduleCommand', () => {
  let handler: Create14DaysScheduleService;
  let hpMockRepository: jest.Mocked<HealthProfessionalRepositoryPort>;
  let hpsMockRepository: jest.Mocked<HealthProfessionalScheduleRepositoryPort>;

  beforeEach(async () => {
    hpsMockRepository = hpMockRepository = {
      insert: jest.fn(),
      findOneById: jest.fn(),
      findAll: jest.fn(),
      findAllPaginated: jest.fn(),
      delete: jest.fn(),
      transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Create14DaysScheduleService,
        {
          provide: HEALTH_PROFESSIONAL_REPOSITORY,
          useValue: hpMockRepository,
        },
        {
          provide: HEALTH_PROFESSIONAL_SCHEDULE_REPOSITORY,
          useValue: hpsMockRepository,
        },
      ],
    }).compile();

    handler = module.get<Create14DaysScheduleService>(
      Create14DaysScheduleService
    );
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should execute the command and generate availabilities', async () => {
    const hp: any = new HealthProfessionalEntity({
      id: '123',
      createdAt: new Date(),
      updatedAt: new Date(),
      props: {
        firstName: 'Taiana',
        lastName: 'Misselis',
        schedule: new Schedule({
          weekDays: [1, 2], // Monday, Tuesday
          timeRange: Interval.parse(
            new Date('2000-01-01T09:30:00.000Z'),
            new Date('2000-01-01T20:00:00.000Z')
          ),
          slotDuration: 'PT15M',
        }),
        timezone: 'Europe/Brussels',
      },
    });

    const command = new Create14DaysScheduleCommand({
      endDate: '2023-08-29T00:00:00.000Z',
      events: [
        {
          endTime: '2023-08-29T20:00:00.000Z',
          startTime: '2023-08-29T18:00:00.000Z',
        },
        {
          endTime: '2023-08-29T11:00:00.000Z',
          startTime: '2023-08-29T09:00:00.000Z',
        },
        {
          endTime: '2023-08-28T16:00:00.000Z',
          startTime: '2023-08-28T12:00:00.000Z',
        },
      ],
      healthProfessionalId: hp.id,
      startDate: '2023-08-28T00:00:00.000Z',
    });

    hpMockRepository.findOneById.mockReturnValueOnce(Promise.resolve(Some(hp)));
    hpsMockRepository.insert.mockReturnValueOnce(Promise.resolve());

    const result = await handler.execute(command);

    expect(hpMockRepository.findOneById).toHaveBeenCalled();
    expect(hpsMockRepository.insert).toHaveBeenCalled();

    expect(result.unwrap()).toBeDefined();
  });
});
