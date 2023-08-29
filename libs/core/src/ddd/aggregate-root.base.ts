import { Entity } from './entity.base';

export abstract class AggregateRoot<EntityProps> extends Entity<EntityProps> {
  // usually we handle here domain events logic (removed for the purpose of the interview test)
}
