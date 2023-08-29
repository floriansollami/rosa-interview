import { ExceptionBase } from '@rosa-interview/core';

export class HealthProfessionalAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Health professional already exists';

  public readonly code = 'HEALTH_PROFESSIONAL.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(HealthProfessionalAlreadyExistsError.message, cause, metadata);
  }
}
