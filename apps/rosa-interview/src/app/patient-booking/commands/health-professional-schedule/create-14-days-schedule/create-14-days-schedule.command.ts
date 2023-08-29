import { Command, CommandProps } from '@rosa-interview/core';

interface ScheduledEventProps {
  endTime: string;
  startTime: string;
}

export class Create14DaysScheduleCommand extends Command {
  readonly endDate!: string;

  readonly events!: ScheduledEventProps[];

  readonly healthProfessionalId!: string;

  readonly startDate!: string;

  constructor(props: CommandProps<Create14DaysScheduleCommand>) {
    super(props);

    this.endDate = props.endDate;
    this.events = props.events;
    this.healthProfessionalId = props.healthProfessionalId;
    this.startDate = props.startDate;
  }
}
