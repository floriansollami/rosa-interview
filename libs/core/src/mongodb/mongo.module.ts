import {
  DynamicModule,
  Global,
  Module,
  ModuleMetadata,
  OnApplicationShutdown,
  Provider,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { MongoClient } from 'mongodb';
import Papr from 'papr';
import {
  CoreModuleAsyncOptions,
  CoreModuleOptions,
} from '../core-options.interface';
import { CORE_MODULE_OPTIONS } from '../core.constants';
import {
  DEFAULT_MONGO_CONNECTION_NAME,
  MONGO_CONNECTION_NAME,
} from './mongo.constants';
import { createMongoProviders } from './mongo.providers';
import { getClientToken, getDbToken } from './mongo.util';

@Global()
@Module({})
export class MongoModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  static forRootAsync(options: CoreModuleAsyncOptions): DynamicModule {
    const mongoConnectionName = DEFAULT_MONGO_CONNECTION_NAME;
    const connectionNameProvider = {
      provide: MONGO_CONNECTION_NAME,
      useValue: mongoConnectionName,
    };
    const papr = new Papr();

    const clientProvider = {
      provide: getClientToken(),
      useFactory: async (coreModuleOptions: CoreModuleOptions) => {
        const { database } = coreModuleOptions;
        const { uri, clientOptions } = database.params;

        const client = new MongoClient(uri, clientOptions);

        return await client.connect();
      },
      inject: [CORE_MODULE_OPTIONS],
    };

    const dbProvider = {
      provide: getDbToken(),
      useFactory: async (
        coreModuleOptions: CoreModuleOptions,
        client: MongoClient
      ) => {
        const { dbName } = coreModuleOptions.database.params;
        const db = client.db(dbName);

        papr.initialize(db);
        await papr.updateSchemas();

        return db;
      },
      inject: [CORE_MODULE_OPTIONS, getClientToken()],
    };

    const paprProvider = {
      provide: 'PAPR',
      useValue: papr,
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: MongoModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        clientProvider,
        dbProvider,
        paprProvider,
        connectionNameProvider,
      ],
      exports: [clientProvider, dbProvider, paprProvider],
    };
  }

  /**
   * Inject collections.
   * @param collections An array of the names of the collections (model) to be injected.
   * @param connectionName A unique name for the connection. If not specified, a default name
   * will be used.
   */
  static forFeature(collections: string[] = []): ModuleMetadata {
    const providers = createMongoProviders(collections);

    return {
      providers: providers,
      exports: providers,
    };
  }

  private static createAsyncProviders(
    options: CoreModuleAsyncOptions
  ): Provider[] {
    if (options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [];
  }

  private static createAsyncOptionsProvider(
    options: CoreModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: CORE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      };
    }

    throw new Error('Invalid CoreModule options');
  }

  async onApplicationShutdown() {
    const client: MongoClient = this.moduleRef.get<any>(getClientToken());

    if (client) {
      await client.close();
    }
  }
}
