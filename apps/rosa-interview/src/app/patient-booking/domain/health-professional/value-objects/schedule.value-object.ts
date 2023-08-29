import { Interval, ValueObject } from '@rosa-interview/core';

/**
 * Note: This is a very simplified example,
 * real world projects I would focus on primitive obsession
 * with Runtypes npm library for performance reason.
 */
export interface ScheduleProps {
  weekDays: number[];
  timeRange: Interval;
  slotDuration: string;
}

export class Schedule extends ValueObject<ScheduleProps> {
  get timeRange(): Interval {
    return this.props.timeRange;
  }

  isOnWeekDay(weekDay: number): boolean {
    return this.props.weekDays.includes(weekDay);
  }

  /**
   * Note: This is a very simplified example of validation,
   * real world projects will have stricter rules.
   * You can avoid this type of validation here and validate
   * only on the edge of the application (in controllers when receiving
   * a request) sacrificing some security for performance and convenience.
   */
  protected validate(props: ScheduleProps): void {
    //   if (!Guard.lengthIsBetween(props.country, 2, 50)) {
    //     throw new ArgumentOutOfRangeException('country is out of range');
    //   }
    //   if (!Guard.lengthIsBetween(props.street, 2, 50)) {
    //     throw new ArgumentOutOfRangeException('street is out of range');
    //   }
    //   if (!Guard.lengthIsBetween(props.postalCode, 2, 10)) {
    //     throw new ArgumentOutOfRangeException('postalCode is out of range');
    //   }
  }
}
