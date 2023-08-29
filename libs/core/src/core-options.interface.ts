import { ModuleMetadata } from '@nestjs/common';
import { MongoModuleOptions } from './mongodb';

export interface CoreModuleOptions {
  database: {
    params: MongoModuleOptions;
  };
}

/**
 * Options available when creating the module asynchrously. You should use only the
 * useFactory options for creation.
 */
export interface CoreModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /**
   * A factory function that will populate the module options.
   */
  useFactory?: (
    ...args: any[]
  ) => Promise<CoreModuleOptions> | CoreModuleOptions;

  /**
   * Inject any dependencies required by the Mongo module, such as a configuration service
   * that supplies the URI and database name.
   */
  inject?: any[];
}
