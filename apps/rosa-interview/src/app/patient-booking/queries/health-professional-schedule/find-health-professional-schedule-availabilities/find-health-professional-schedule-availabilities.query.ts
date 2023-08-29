import { PaginatedParams, PaginatedQueryBase } from '@rosa-interview/core';

export class FindHealthProfessionalScheduleAvailabilitiesQuery extends PaginatedQueryBase {
  readonly healthProfessionalId!: string;

  readonly from!: string;

  readonly to!: string;

  constructor(
    props: PaginatedParams<FindHealthProfessionalScheduleAvailabilitiesQuery>
  ) {
    super(props);

    this.healthProfessionalId = props.healthProfessionalId;
    this.from = props.from;
    this.to = props.to;
  }
}
