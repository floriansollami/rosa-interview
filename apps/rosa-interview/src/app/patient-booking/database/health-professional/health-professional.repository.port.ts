import { RepositoryPort } from '@rosa-interview/core';
import { HealthProfessionalEntity } from '../../domain';

// export interface FindUsersParams extends PaginatedQueryParams {
//   readonly country?: string;
//   readonly postalCode?: string;
//   readonly street?: string;
// }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HealthProfessionalRepositoryPort
  extends RepositoryPort<HealthProfessionalEntity> {
  // findOneByEmail(email: string): Promise<HealthProfessionalEntity | null>;
}
