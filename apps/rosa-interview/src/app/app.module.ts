import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoreModule } from '@rosa-interview/core';
import { PatientBookingModule } from './patient-booking';

@Module({
  imports: [
    CoreModule.forRootAsync({
      imports: [ConfigModule.forRoot({})],
      useFactory: (config: ConfigService) => {
        return {
          database: {
            params: {
              uri: config.getOrThrow('MONGO_URI'),
              dbName: config.getOrThrow('MONGO_DATABASE_NAME'),
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    PatientBookingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
