import { Interval, ValueObject } from '@rosa-interview/core';

export const Status = {
  CONFIRMED: 'CONFIRMED',
} as const;

export type StatusEnum = keyof typeof Status;

export interface ScheduledEventProps {
  patientId?: string | undefined;
  period: Interval;
  status: StatusEnum;
}

type CreateFromPartialProps = Omit<ScheduledEventProps, 'status'>;

export class ScheduledEvent extends ValueObject<ScheduledEventProps> {
  get period(): Interval {
    return this.props.period;
  }

  static createFromPartialProps(props: CreateFromPartialProps): ScheduledEvent {
    return new ScheduledEvent({ ...props, status: Status.CONFIRMED });
  }

  overlaps(interval: Interval): boolean {
    return this.props.period.overlaps(interval);
  }

  /**
   * Note: This is a very simplified example of validation,
   * real world projects will have stricter rules.
   * You can avoid this type of validation here and validate
   * only on the edge of the application (in controllers when receiving
   * a request) sacrificing some security for performance and convenience.
   */
  protected validate(props: ScheduledEventProps): void {
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
