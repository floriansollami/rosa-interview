import { Duration as LDuration } from 'luxon';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsISO8601DurationConstraint
  implements ValidatorConstraintInterface
{
  validate(duration: string) {
    return LDuration.fromISO(duration).isValid;
  }

  defaultMessage() {
    return 'ISO8601 duration is invalid!';
  }
}
