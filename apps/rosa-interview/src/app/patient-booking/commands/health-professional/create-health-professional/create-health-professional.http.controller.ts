import {
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AggregateID,
  ApiErrorResponse,
  IdResponse,
} from '@rosa-interview/core';
import { Result, match } from 'oxide.ts';
import { HealthProfessionalAlreadyExistsError } from '../../../domain';
import { CreateHealthProfessionalCommand } from './create-health-professional.command';
import { CreateHealthProfessionalRequestDto } from './create-health-professional.request.dto';

@Controller('health-professional') // TODO aux pluriel ?
export class CreateHealthProfessionalController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Create a health professional' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: HealthProfessionalAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @Post()
  async create(
    @Body() body: CreateHealthProfessionalRequestDto
  ): Promise<IdResponse> {
    const command = new CreateHealthProfessionalCommand(body);

    const result: Result<AggregateID, HealthProfessionalAlreadyExistsError> =
      await this.commandBus.execute(command);

    // Deciding what to do with a Result (similar to Rust matching)
    // if Ok we return a response with an id
    // if Error decide what to do with it depending on its type
    return match(result, {
      Ok: (id: string) => new IdResponse(id),
      Err: (error: Error) => {
        if (error instanceof HealthProfessionalAlreadyExistsError) {
          throw new ConflictHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
