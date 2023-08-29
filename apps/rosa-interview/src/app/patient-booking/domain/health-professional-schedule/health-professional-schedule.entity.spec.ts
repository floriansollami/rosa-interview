import { DateTime, Interval } from '@rosa-interview/core';
import TreeMap from 'ts-treemap';
import { HealthProfessionalEntity } from '../health-professional/health-professional.entity';
import { Schedule } from '../health-professional/value-objects';
import { HealthProfessionalScheduleEntity } from './health-professional-schedule.entity';
import { Availability, ScheduledEvent } from './value-objects';

describe('HealthProfessionalScheduleEntity', () => {
  it('should generate availabilities correctly', () => {
    // Arrange
    const hp = new HealthProfessionalEntity({
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

    const events = [
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
    ];

    const hps = HealthProfessionalScheduleEntity.createWithoutAvailabilities({
      healthProfessionalId: hp.id,
      period: Interval.parse(
        new Date('2023-08-28T00:00:00.000Z'),
        new Date('2023-08-29T00:00:00.000Z')
      ),
      scheduledEvents: TreeMap.fromMap(
        events.reduce(
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

    // Act
    hps.generateAvailabilities(hp);

    // Assert
    const result = hps.getProps().availabilities;

    expect(result).toEqual([
      new Availability({
        endTime: DateTime.parse('2023-08-28T12:00:00.000Z'),
        startTime: DateTime.parse('2023-08-28T09:30:00.000Z'),
      }),
      new Availability({
        endTime: DateTime.parse('2023-08-28T20:00:00.000Z'),
        startTime: DateTime.parse('2023-08-28T16:00:00.000Z'),
      }),
      new Availability({
        endTime: DateTime.parse('2023-08-29T18:00:00.000Z'),
        startTime: DateTime.parse('2023-08-29T11:00:00.000Z'),
      }),
    ]);
  });
});
