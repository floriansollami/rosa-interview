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
    return hp;
  }

  isAvailableOnWeekDay(weekDay: number): boolean {
    return this.props.schedule.isOnWeekDay(weekDay);
  }

  getScheduleTimeRange(): Interval {
    return this.props.schedule.timeRange;
  }

  // getAvailableTimeRangeUnits() {
  //   // { hour: 9, minute: 30, second: 0, millisecond: 0 }

  //   return this.props.schedule.getTimeRangeUnits();
  // }

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
  updateAddress(props: any): void {
    // const newAddress = new Address({
    //   ...this.props.address,
    //   ...props,
    // } as AddressProps);
    // this.props.address = newAddress;
    // this.addEvent(
    //   new UserAddressUpdatedDomainEvent({
    //     aggregateId: this.id,
    //     country: newAddress.country,
    //     street: newAddress.street,
    //     postalCode: newAddress.postalCode,
    //   })
    // );
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
