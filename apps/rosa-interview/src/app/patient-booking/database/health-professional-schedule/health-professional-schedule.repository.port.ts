import { RepositoryPort } from '@rosa-interview/core';
import { HealthProfessionalScheduleEntity } from '../../domain';

// export interface FindUsersParams extends PaginatedQueryParams {
//   readonly country?: string;
//   readonly postalCode?: string;
//   readonly street?: string;
// }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HealthProfessionalScheduleRepositoryPort extends RepositoryPort<HealthProfessionalScheduleEntity> {
  // findOneByEmail(email: string): Promise<HealthProfessionalEntity | null>;
}
