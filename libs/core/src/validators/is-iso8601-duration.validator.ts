import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsISO8601DurationConstraint } from './constraints';

export function IsISO8601Duration<T extends object>(
  validationOptions?: ValidationOptions
) {
  return (object: T, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsISO8601DurationConstraint,
    });
  };
}
