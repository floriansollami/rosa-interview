import { Schedule } from './value-objects';

export interface HealthProfessionalProps {
  firstName: string;
  lastName: string;
  schedule: Schedule;
  timezone: string;
}

export type CreateHealthProfessionalProps = HealthProfessionalProps;
