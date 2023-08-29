import { PaginatedParams } from '@rosa-interview/core';

export class FindHealthProfessionalScheduleFirstAvailabilityQuery {
  readonly healthProfessionalId!: string;

  readonly from!: string;

  constructor(
    props: PaginatedParams<FindHealthProfessionalScheduleFirstAvailabilityQuery>
  ) {
    this.healthProfessionalId = props.healthProfessionalId;
    this.from = props.from;
  }
}
