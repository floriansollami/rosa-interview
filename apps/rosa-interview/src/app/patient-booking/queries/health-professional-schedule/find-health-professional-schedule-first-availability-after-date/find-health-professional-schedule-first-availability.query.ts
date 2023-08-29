export class FindHealthProfessionalScheduleFirstAvailabilityQuery {
  readonly healthProfessionalId!: string;

  readonly from!: string;

  constructor(props: FindHealthProfessionalScheduleFirstAvailabilityQuery) {
    this.healthProfessionalId = props.healthProfessionalId;
    this.from = props.from;
  }
}
