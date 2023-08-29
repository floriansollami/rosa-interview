
import {
    ValidationOptions,
    registerDecorator
} from 'class-validator';
import { IsTimezoneConstraint } from './constraints';

export function IsTimezone<T extends object>(
    validationOptions?: ValidationOptions
  ) {
    return (object: T, propertyName: string) => {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsTimezoneConstraint,
      });
    };
  }
  