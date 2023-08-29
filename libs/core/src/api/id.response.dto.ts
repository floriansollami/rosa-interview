import { ApiProperty } from '@nestjs/swagger';

export class IdResponse {
  @ApiProperty({ example: '2cdc8ab1-6d50-49cc-ba14-54e4ac7ec231' })
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
