import { ModuleMetadata } from '@nestjs/common';

/**
 * Options that ultimately need to be provided to create a MongoDB connection
 */
export interface MongoModuleOptions {
  connectionName?: string;
  uri: string;
  dbName: string;
  clientOptions?: any;
}

/**
 * Options available when creating the module asynchronously. You should use only the
 * useFactory options for creation.
 */
export interface MongoModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /**
   * A factory function that will populate the module options.
   */
  useFactory?: (
    ...args: any[]
  ) => Promise<MongoModuleOptions> | MongoModuleOptions;

  /**
   * Inject any dependencies required by the Mongo module, such as a configuration service
   * that supplies the URI and database name.
   */
  inject?: any[];
}
