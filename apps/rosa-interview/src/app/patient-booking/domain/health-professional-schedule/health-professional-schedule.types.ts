import { Interval } from '@rosa-interview/core';
import TreeMap from 'ts-treemap';
import { Availability, ScheduledEvent } from './value-objects';

export interface HealthProfessionalScheduleProps {
  availabilities: Availability[];
  healthProfessionalId: string;
  period: Interval;

  /**
   * Using the startTime as the key ensures that the TreeMap
   * will keep the events in sorted order based on their start times.
   * When you insert a new event into the TreeMap, it will automatically
   * be placed in the correct position based on its start time.
   * Of course if you expect to have multiple events with the same start time,
   * you'll need to adjust the data structure to handle that,
   */
  scheduledEvents: TreeMap<Date, ScheduledEvent>;
  timezone: string;
}

export type CreateHealthProfessionalScheduleProps =
  HealthProfessionalScheduleProps;

export type CreateHealthProfessionalScheduleWithoutAvailabilitiesProps = Omit<
  HealthProfessionalScheduleProps,
  'availabilities'
>;
