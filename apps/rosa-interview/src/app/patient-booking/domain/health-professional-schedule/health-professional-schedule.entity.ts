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
   *
   * VERY IMPORTANT: WE SHOULD ALWAYS GENERATE THE AVAILABILITIES IN THE TIME ZONE OF THE USER!
   * BUT WE STORE THEM AFTER IN UTC (ISO8601)
   */
  generateAvailabilities(healthProfessional: HealthProfessionalEntity): void {
    const timezone = healthProfessional.timezone;
    const workingSchedule = healthProfessional.getScheduleTimeRange();
    const startTime = workingSchedule.start.toTZ(timezone);
    const endTime = workingSchedule.end.toTZ(timezone);

    const availabilities = [];

    // Loop through each day in the date range in HP schedule
    for (const currentDay of this.scheduleDateRangeIterator(timezone)) {
      const weekday = currentDay.getWeekDay();

      // TODO faire une methode isAvailable dans la classe health professional
      // comme ca on envoie pas le week day, on demande direct si il est dispo a cette date

      // Check if health professional is available on this week day
      if (healthProfessional.isAvailableOnWeekDay(weekday)) {
        //
        // Define the availability interval for that day
        const initialAvailability = Interval.parse(
          currentDay.setTimeUnits(startTime),
          currentDay.setTimeUnits(endTime)
        );
        let availableIntervals = [initialAvailability];

        // Loop through scheduled events to subtract them from the availability
        for (const event of this.props.scheduledEvents.values()) {
          // If the event overlaps with the initial availability
          //
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

  private *scheduleDateRangeIterator(timezone: string) {
    let currentDay = this.props.period.start.toTZ(timezone);

    while (currentDay.isBefore(this.props.period.end.toTZ(timezone))) {
      yield currentDay;
      currentDay = currentDay.plus({ days: 1 });
    }
  }
}
