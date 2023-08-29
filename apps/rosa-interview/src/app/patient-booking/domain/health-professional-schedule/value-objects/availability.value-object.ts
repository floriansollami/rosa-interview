import { DateTime, ValueObject } from '@rosa-interview/core';

export interface AvailabilityProps {
  endTime: DateTime;
  startTime: DateTime;
}

export class Availability extends ValueObject<AvailabilityProps> {
  // get country(): string {
  //   return this.props.country;
  // }

  /**
   * Note: This is a very simplified example of validation,
   * real world projects will have stricter rules.
   * You can avoid this type of validation here and validate
   * only on the edge of the application (in controllers when receiving
   * a request) sacrificing some security for performance and convenience.
   */
  protected validate(props: AvailabilityProps): void {
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
