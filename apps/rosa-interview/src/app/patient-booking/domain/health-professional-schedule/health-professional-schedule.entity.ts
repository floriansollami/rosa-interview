import { AggregateID, AggregateRoot, Interval } from '@rosa-interview/core';
import { v4 } from 'uuid';
import {
  CreateHealthProfessionalScheduleProps,
  CreateHealthProfessionalScheduleWithoutAvailabilitiesProps,
  HealthProfessionalScheduleProps,
} from './health-professional-schedule.types';
import { Availability } from './value-objects';
import { HealthProfessionalEntity } from '../health-professional/health-professional.entity';

export class HealthProfessionalScheduleEntity extends AggregateRoot<HealthProfessionalScheduleProps> {
  private static readonly SCHEDULE_PERIOD_DURATION_IN_DAYS = 14;
  protected readonly _id!: AggregateID;

  static create(
    props: CreateHealthProfessionalScheduleProps
  ): HealthProfessionalScheduleEntity {
    const id = v4();
    const hps = new HealthProfessionalScheduleEntity({ id, props });

    return hps;
  }

  static createWithoutAvailabilities(
    props: CreateHealthProfessionalScheduleWithoutAvailabilitiesProps
  ) {
    return HealthProfessionalScheduleEntity.create({
      availabilities: [],
      ...props,
    });
  }

  /**
   * Your current algorithm iterates over each day and then iterates over each event
   * for that day, checking for overlaps. Since your events are already sorted,
   * you could use a single pointer to traverse the events, similar to the optimized
   * algorithm I described earlier.
   */
  generateAvailabilities(healthProfessional: HealthProfessionalEntity): void {
    const timeRange = healthProfessional.getScheduleTimeRange();
    const availabilities = [];

    // Loop through each day in the 14-day range
    for (const currentDay of this.generate14Days()) {
      const weekday = currentDay.getWeekDay();

      // Check if health professional is available on this week day
      if (healthProfessional.isAvailableOnWeekDay(weekday)) {
        // Define the availability interval for that day
        const availableStart = currentDay.set(timeRange.start.getTimeUnits());
        const availableEnd = currentDay.set(timeRange.end.getTimeUnits());

        const initialAvailability = Interval.parseFromDateTime(
          availableStart,
          availableEnd
        );
        let availableIntervals = [initialAvailability];

        // Loop through scheduled events to subtract them from the availability
        for (const event of this.props.scheduledEvents.values()) {
          // If the event overlaps with the initial availability
          if (event.overlaps(initialAvailability)) {
            const newAvailableIntervals = [];

            for (const interval of availableIntervals) {
              const subtracted = interval.difference(event.period);
              newAvailableIntervals.push(...subtracted);
            }

            availableIntervals = newAvailableIntervals;
          }
        }

        availabilities.push(
          ...availableIntervals.map(
            (av) =>
              new Availability({
                startTime: av.start,
                endTime: av.end,
              })
          )
        );
      }
    }

    this.props.availabilities = availabilities;
  }

  // entity business rules validation to protect it's invariant before saving entity to a database
  validate(): void {
    // if (
    //   this.props.period.lengthInDays() !==
    //   HealthProfessionalScheduleEntity.SCHEDULE_PERIOD_DURATION_IN_DAYS
    // ) {
    //   throw new Error('period duration invalid');
    // }
  }

  private *generate14Days() {
    let currentDay = this.props.period.start;

    while (currentDay.isSameOrBefore(this.props.period.end)) {
      yield currentDay;
      currentDay = currentDay.plus({ days: 1 });
    }
  }
}
