import { AggregateID, AggregateRoot, Interval } from '@rosa-interview/core';
import { v4 } from 'uuid';
import {
  CreateHealthProfessionalProps,
  HealthProfessionalProps,
} from './health-professional.types';

export class HealthProfessionalEntity extends AggregateRoot<HealthProfessionalProps> {
  protected readonly _id!: AggregateID;

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */
  get timezone(): string {
    return this.props.timezone;
  }

  static create(
    create: CreateHealthProfessionalProps
  ): HealthProfessionalEntity {
    const id = v4();
    const hp = new HealthProfessionalEntity({ id, props: create });

    return hp;
  }

  isAvailableOnWeekDay(weekDay: number): boolean {
    return this.props.schedule.isOnWeekDay(weekDay);
  }

  getScheduleTimeRange(): Interval {
    return this.props.schedule.timeRange;
  }

  /**
   * Note: This is a very simplified example of validation,
   * real world projects will have stricter rules.
   * You can avoid this type of validation here and validate
   * only on the edge of the application (in controllers when receiving
   * a request) sacrificing some security for performance and convenience.
   */
  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
