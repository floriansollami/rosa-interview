import { AggregateID, AggregateRoot, Interval } from '@rosa-interview/core';
import { v4 } from 'uuid';
import { HealthProfessionalEntity } from '../health-professional/health-professional.entity';
import {
  CreateHealthProfessionalScheduleProps,
  CreateHealthProfessionalScheduleWithoutAvailabilitiesProps,
  HealthProfessionalScheduleProps,
} from './health-professional-schedule.types';
import { Availability } from './value-objects';

export class HealthProfessionalScheduleEntity extends AggregateRoot<HealthProfessionalScheduleProps> {
  private static readonly SCHEDULE_PERIOD_DURATION_IN_DAYS = 14;
  protected readonly _id!: AggregateID;

  static create(
    props: CreateHealthProfessionalScheduleProps
  ): HealthProfessionalScheduleEntity {
    const id = v4();
    const hps = new HealthProfessionalScheduleEntity({ id, props });

    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    // user.addEvent(
    //   new UserCreatedDomainEvent({
    //     aggregateId: id,
    //     email: props.email,
    //     ...props.address.unpack(),
    //   })
    // );
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
    console.log(
      this.props.availabilities.map((av: any) => ({
        startTime: av.props.startTime.toISO8601String(),
        endTime: av.props.endTime.toISO8601String(),
      }))
    );

    // console.dir(
    //   availabilities.map((av) => ({
    //     date: av.date.toISO8601String(),
    //     intervals: av.intervals.map((int) => ({
    //       start: int.start.toISO8601String(),
    //       end: int.end.toISO8601String(),
    //     })),
    //   })),
    //   { depth: null }
    // );
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */
  // get role(): UserRoles {
  //   return this.props.role;
  // }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like user.email = otherEmail */
  // updateAddress(props: any): void {
  //   // const newAddress = new Address({
  //   //   ...this.props.address,
  //   //   ...props,
  //   // } as AddressProps);
  //   // this.props.address = newAddress;
  //   // this.addEvent(
  //   //   new UserAddressUpdatedDomainEvent({
  //   //     aggregateId: this.id,
  //   //     country: newAddress.country,
  //   //     street: newAddress.street,
  //   //     postalCode: newAddress.postalCode,
  //   //   })
  //   // );
  // }

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
