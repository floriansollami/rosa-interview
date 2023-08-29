import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601Duration, IsTimezone } from '@rosa-interview/core';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsIn,
  IsString,
  Matches,
  ValidateNested
} from 'class-validator';

// export class CreateHealthProfessionalRequestDto {
//   @ApiProperty({
//     example: 'john@gmail.com',
//     description: 'User email address',
//   })
//   @MaxLength(320)
//   @MinLength(5)
//   @IsEmail()
//   readonly email: string;

//   @ApiProperty({ example: 'France', description: 'Country of residence' })
//   @MaxLength(50)
//   @MinLength(4)
//   @IsString()
//   @Matches(/^[a-zA-Z ]*$/)
//   readonly country: string;

//   @ApiProperty({ example: '28566', description: 'Postal code' })
//   @MaxLength(10)
//   @MinLength(4)
//   @IsAlphanumeric()
//   readonly postalCode: string;

//   @ApiProperty({ example: 'Grande Rue', description: 'Street' })
//   @MaxLength(50)
//   @MinLength(5)
//   @Matches(/^[a-zA-Z ]*$/)
//   readonly street: string;
// }

///////

export class CreateHealthProfessionalScheduleTimeRangeDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Hours must be in the format HH:mm',
  })
  readonly end!: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Hours must be in the format HH:mm',
  })
  readonly start!: string;
}

export class CreateHealthProfessionalScheduleDto {
  @ApiProperty({ type: 'number', isArray: true })
  @IsDefined()
  @IsArray()
  @IsIn([1, 2, 3, 4, 5, 6, 7], { each: true })
  readonly weekDays!: number[];

  @ApiProperty({ type: () => CreateHealthProfessionalScheduleTimeRangeDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateHealthProfessionalScheduleTimeRangeDto)
  readonly timeRange!: CreateHealthProfessionalScheduleTimeRangeDto;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsISO8601Duration()
  readonly slotDuration!: string;
}

export class CreateHealthProfessionalRequestDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  readonly firstName!: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  readonly lastName!: string;

  @ApiProperty({ type: () => CreateHealthProfessionalScheduleDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateHealthProfessionalScheduleDto)
  readonly schedule!: CreateHealthProfessionalScheduleDto;

  @ApiProperty({ example: 'Europe/Brussels', description: 'IANA valid zone' })
  @IsDefined()
  @IsString()
  @IsTimezone()
  readonly timezone!: string;
}
