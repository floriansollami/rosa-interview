import { DynamicModule, Global, Module } from '@nestjs/common';
import { CoreModuleAsyncOptions } from './core-options.interface';
import { MongoModule } from './mongodb';

/**
 * Module for the core logic (core lib)
 */
@Global()
@Module({})
export class CoreModule {
  /**
   * Inject asynchronously, allowing any dependencies such as a configuration
   * service to be injected first.
   * @param options Options for asynchrous injection
   */
  static forRootAsync(options: CoreModuleAsyncOptions): DynamicModule {
    return {
      module: CoreModule,
      imports: [MongoModule.forRootAsync(options)],
    };
  }

  /**
   * Inject collections.
   * @param collections An array of the names of the collections (model) to be injected.
   * @param connectionName A unique name for the connection. If not specified, a default name
   * will be used.
   */
  static forFeature(collections: string[] = []): DynamicModule {
    return {
      module: CoreModule,
      ...MongoModule.forFeature(collections),
    };
  }
}
