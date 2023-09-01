import { Test, TestingModule } from '@nestjs/testing';
import { DateTime, Interval } from '@rosa-interview/core';
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

  describe('when hp schedule date range duration is 14 day', () => {
    describe('when availableIntervals length is 1', () => {
      it('should execute the command and generate availabilities', async () => {
        const hp: any = new HealthProfessionalEntity({
          id: 'c84cc145-1781-4e33-943d-7674242b322c',
          createdAt: new Date(),
          updatedAt: new Date(),
          props: {
            firstName: 'Taiana',
            lastName: 'Misselis',
            schedule: new Schedule({
              weekDays: [1, 2], // Monday, Tuesday
              timeRange: Interval.parseFromJSDate(
                new Date('2000-01-01T08:30:00.000Z'), // January 1, 2000, at 9:30 AM in the Europe/Brussels time zone.
                new Date('2000-01-01T19:00:00.000Z') // January 1, 2000, at 8:00 PM in the Europe/Brussels time zone.
              ),
              slotDuration: 'PT15M',
            }),
            timezone: 'Europe/Brussels',
          },
        });

        const command = new Create14DaysScheduleCommand({
          // START DATE: 2023-08-14T00:00:00 local time in Brussels (2023-08-13T22:00:00.000Z UTC)
          // END DATE: 2023-08-28T00:00:00 local time in Brussels (2023-08-27T22:00:00.000Z UTC)

          // In many programming contexts, ranges are often defined as "inclusive of the start point
          // and exclusive of the end point." This is sometimes referred to as a "half-open" interval,
          // denoted as [start, end).

          // Meaning as a mathematical interval:
          // [2023-08-14T00:00:00, 2023-08-28T00:00:00[
          // means actually [2023-08-28T00:00:00, 2023-08-28T23:59:59.599999] = 14 day duration

          endDate: '2023-08-27T22:00:00.000Z',
          startDate: '2023-08-13T22:00:00.000Z',

          events: [
            // NOTE: ORDER BY DATE NOT REQUIRED

            {
              // 2023-08-14T16:00:00 local time in Brussels
              endTime: '2023-08-14T14:00:00.000Z',
              // 2023-08-14T12:00:00 local time in Brussels
              startTime: '2023-08-14T10:00:00.000Z',
            },

            {
              // 2023-08-15T11:00:00 local time in Brussels
              endTime: '2023-08-15T09:00:00.000Z',
              // 2023-08-15T09:00:00 local time in Brussels
              startTime: '2023-08-15T07:00:00.000Z',
            },
            {
              // 2023-08-15T20:00:00 local time in Brussels
              endTime: '2023-08-15T18:00:00.000Z',
              // 2023-08-15T18:00:00 local time in Brussels
              startTime: '2023-08-15T16:00:00.000Z',
            },
          ],
          healthProfessionalId: hp.id,
        });

        hpMockRepository.findOneById.mockReturnValueOnce(
          Promise.resolve(Some(hp))
        );
        hpsMockRepository.insert.mockReturnValueOnce(Promise.resolve());

        const result = await handler.execute(command);

        expect(hpMockRepository.findOneById).toHaveBeenCalled();
        expect(hpsMockRepository.insert).toHaveBeenCalledWith(
          expect.objectContaining({
            props: expect.objectContaining({
              availabilities: expect.arrayContaining([
                expect.objectContaining({
                  props: expect.objectContaining({
                    // 2023-08-14T12:00:00 local time in Brussels
                    endTime: DateTime.parse('2023-08-14T10:00:00.000Z'),
                    // 2023-08-14T09:30:00 local time in Brussels
                    startTime: DateTime.parse('2023-08-14T07:30:00.000Z'),
                  }),
                }),

                expect.objectContaining({
                  props: expect.objectContaining({
                    // 2023-08-14T20:00:00 local time in Brussels
                    endTime: DateTime.parse('2023-08-14T18:00:00.000Z'),
                    // 2023-08-14T16:00:00 local time in Brussels
                    startTime: DateTime.parse('2023-08-14T14:00:00.000Z'),
                  }),
                }),

                expect.objectContaining({
                  props: expect.objectContaining({
                    // 2023-08-15T18:00:00 local time in Brussels
                    endTime: DateTime.parse('2023-08-15T16:00:00.000Z'),
                    // 2023-08-15T11:00:00 local time in Brussels
                    startTime: DateTime.parse('2023-08-15T09:00:00.000Z'),
                  }),
                }),

                expect.objectContaining({
                  props: expect.objectContaining({
                    // 2023-08-21T20:00:00 local time in Brussels
                    endTime: DateTime.parse('2023-08-21T18:00:00.000Z'),
                    // 2023-08-21T09:30:00 local time in Brussels
                    startTime: DateTime.parse('2023-08-21T07:30:00.000Z'),
                  }),
                }),

                expect.objectContaining({
                  props: expect.objectContaining({
                    // 2023-08-21T20:00:00 local time in Brussels
                    endTime: DateTime.parse('2023-08-22T18:00:00.000Z'),
                    // 2023-08-21T09:30:00 local time in Brussels
                    startTime: DateTime.parse('2023-08-22T07:30:00.000Z'),
                  }),
                }),
              ]),
            }),
          })
        );

        expect(result.unwrap()).toBeDefined();
      });
    });

    describe('when availableIntervals length is 2', () => {
      it('should execute the command and generate availabilities', async () => {
        const hp: any = new HealthProfessionalEntity({
          id: 'c84cc145-1781-4e33-943d-7674242b322c',
          createdAt: new Date(),
          updatedAt: new Date(),
          props: {
            firstName: 'Taiana',
            lastName: 'Misselis',
            schedule: new Schedule({
              weekDays: [1, 2], // Monday, Tuesday
              timeRange: Interval.parseFromJSDate(
                new Date('2000-01-01T08:30:00.000Z'), // January 1, 2000, at 9:30 AM in the Europe/Brussels time zone.
                new Date('2000-01-01T19:00:00.000Z') // January 1, 2000, at 8:00 PM in the Europe/Brussels time zone.
              ),
              slotDuration: 'PT15M',
            }),
            timezone: 'Europe/Brussels',
          },
        });

        const command = new Create14DaysScheduleCommand({
          // START DATE: 2023-08-14T00:00:00 local time in Brussels (2023-08-13T22:00:00.000Z UTC)
          // END DATE: 2023-08-28T00:00:00 local time in Brussels (2023-08-27T22:00:00.000Z UTC)

          // In many programming contexts, ranges are often defined as "inclusive of the start point
          // and exclusive of the end point." This is sometimes referred to as a "half-open" interval,
          // denoted as [start, end).

          // Meaning as a mathematical interval:
          // [2023-08-14T00:00:00, 2023-08-28T00:00:00[
          // means actually [2023-08-28T00:00:00, 2023-08-28T23:59:59.599999] = 14 day duration

          endDate: '2023-08-27T22:00:00.000Z',
          startDate: '2023-08-13T22:00:00.000Z',

          events: [
            // NOTE: ORDER BY DATE NOT REQUIRED

            {
              // 2023-08-14T16:00:00 local time in Brussels
              endTime: '2023-08-14T14:00:00.000Z',
              // 2023-08-14T12:00:00 local time in Brussels
              startTime: '2023-08-14T10:00:00.000Z',
            },

            {
              // 2023-08-14T11:00:00 local time in Brussels
              endTime: '2023-08-14T09:00:00.000Z',
              // 2023-08-14T10:00:00 local time in Brussels
              startTime: '2023-08-14T08:00:00.000Z',
            },

            {
              // 2023-08-15T11:00:00 local time in Brussels
              endTime: '2023-08-15T09:00:00.000Z',
              // 2023-08-15T09:00:00 local time in Brussels
              startTime: '2023-08-15T07:00:00.000Z',
            },
            {
              // 2023-08-15T20:00:00 local time in Brussels
              endTime: '2023-08-15T18:00:00.000Z',
              // 2023-08-15T18:00:00 local time in Brussels
              startTime: '2023-08-15T16:00:00.000Z',
            },
          ],
          healthProfessionalId: hp.id,
        });

        hpMockRepository.findOneById.mockReturnValueOnce(
          Promise.resolve(Some(hp))
        );
        hpsMockRepository.insert.mockReturnValueOnce(Promise.resolve());

        const result = await handler.execute(command);

        expect(hpMockRepository.findOneById).toHaveBeenCalled();
        expect(hpsMockRepository.insert).toHaveBeenCalledWith(
          expect.objectContaining({
            props: expect.objectContaining({
              availabilities: expect.arrayContaining([
                expect.objectContaining({
                  props: expect.objectContaining({
                    // 2023-08-14T10:00:00 local time in Brussels
                    endTime: DateTime.parse('2023-08-14T08:00:00.000Z'),
                    // 2023-08-14T09:30:00 local time in Brussels
                    startTime: DateTime.parse('2023-08-14T07:30:00.000Z'),
                  }),
                }),

                expect.objectContaining({
                  props: expect.objectContaining({
                    // 2023-08-14T12:00:00 local time in Brussels
                    endTime: DateTime.parse('2023-08-14T10:00:00.000Z'),
                    // 2023-08-14T11:00:00 local time in Brussels
                    startTime: DateTime.parse('2023-08-14T09:00:00.000Z'),
                  }),
                }),

                expect.objectContaining({
                  props: expect.objectContaining({
                    // 2023-08-14T20:00:00 local time in Brussels
                    endTime: DateTime.parse('2023-08-14T18:00:00.000Z'),
                    // 2023-08-14T16:00:00 local time in Brussels
                    startTime: DateTime.parse('2023-08-14T14:00:00.000Z'),
                  }),
                }),

                expect.objectContaining({
                  props: expect.objectContaining({
                    // 2023-08-15T18:00:00 local time in Brussels
                    endTime: DateTime.parse('2023-08-15T16:00:00.000Z'),
                    // 2023-08-15T11:00:00 local time in Brussels
                    startTime: DateTime.parse('2023-08-15T09:00:00.000Z'),
                  }),
                }),

                expect.objectContaining({
                  props: expect.objectContaining({
                    // 2023-08-21T20:00:00 local time in Brussels
                    endTime: DateTime.parse('2023-08-21T18:00:00.000Z'),
                    // 2023-08-21T09:30:00 local time in Brussels
                    startTime: DateTime.parse('2023-08-21T07:30:00.000Z'),
                  }),
                }),

                expect.objectContaining({
                  props: expect.objectContaining({
                    // 2023-08-21T20:00:00 local time in Brussels
                    endTime: DateTime.parse('2023-08-22T18:00:00.000Z'),
                    // 2023-08-21T09:30:00 local time in Brussels
                    startTime: DateTime.parse('2023-08-22T07:30:00.000Z'),
                  }),
                }),
              ]),
            }),
          })
        );

        expect(result.unwrap()).toBeDefined();
      });
    });
  });
});
