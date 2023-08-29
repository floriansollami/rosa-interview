/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { None, Option, Some } from 'oxide.ts';
import { Model } from 'papr';
import {
  AggregateRoot,
  Mapper,
  Paginated,
  PaginatedQueryParams,
  RepositoryPort,
} from '../ddd';
import { ConflictException } from '../exceptions';
import { ObjectLiteral } from '../types';

export class DriverException extends Error {
  code?: string;
  errno?: number;
  errmsg?: string;

  constructor(previous: Error) {
    super(previous.message);
    Object.assign(this, previous);
    this.name = this.constructor.name;
    this.stack += '\n\n' + 'previous ' + previous.stack;
  }
}

export abstract class MongoRepositoryBase<
  Aggregate extends AggregateRoot<any>,
  DbModel extends ObjectLiteral
> implements RepositoryPort<Aggregate>
{
  protected constructor(
    protected readonly model: Model<any, any>,
    protected readonly mapper: Mapper<Aggregate, DbModel>
  ) {}

  async insert(entity: Aggregate): Promise<void> {
    const record = this.mapper.toPersistence(entity);
    entity.validate();

    await this.rethrow(this.model.insertOne(record));
  }

  async findOneById(id: string): Promise<Option<Aggregate>> {
    const record = await this.model.findById(id);

    if (!record) {
      return None;
    }

    return Some(this.mapper.toDomain(record));
  }

  findAll(): Promise<Aggregate[]> {
    throw new Error('Method not implemented.');
  }

  findAllPaginated(
    _params: PaginatedQueryParams
  ): Promise<Paginated<Aggregate>> {
    throw new Error('Method not implemented.');
  }

  delete(_entity: Aggregate): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  transaction<T>(_handler: () => Promise<T>): Promise<T> {
    throw new Error('Method not implemented.');
  }

  convertException(exception: Error & Record<string, any>): DriverException {
    switch (exception['code']) {
      case 11000:
        throw new ConflictException('Record already exists', exception);
    }

    return new DriverException(exception);
  }

  protected rethrow<T>(promise: Promise<T>): Promise<T> {
    return promise.catch((e) => {
      throw this.convertException(e);
    });
  }
}
