import { Command, CommandProps } from '@rosa-interview/core';

interface TimeRangeProps {
  end: string;
  start: string;
}

interface ScheduleProps {
  weekDays: number[];
  timeRange: TimeRangeProps;
  slotDuration: string;
}

export class CreateHealthProfessionalCommand extends Command {
  readonly firstName: string;

  readonly lastName: string;

  readonly schedule: ScheduleProps;

  readonly timezone: string;

  constructor(props: CommandProps<CreateHealthProfessionalCommand>) {
    super(props);

    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.schedule = props.schedule;
    this.timezone = props.timezone;
  }
}
