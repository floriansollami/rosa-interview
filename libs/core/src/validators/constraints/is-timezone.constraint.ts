import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IANAZone } from 'luxon';

@ValidatorConstraint({ async: false })
export class IsTimezoneConstraint implements ValidatorConstraintInterface {
  validate(timezone: string) {
    return IANAZone.isValidZone(timezone);
  }

  defaultMessage() {
    return 'Timezone is invalid!';
  }
}
