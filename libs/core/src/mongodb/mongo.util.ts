import { DEFAULT_MONGO_CONNECTION_NAME } from './mongo.constants';

/**
 * Get a token for the MongoClient object for the given connection name
 * @param connectionName The unique name for the connection
 */
export function getClientToken() {
  return `${DEFAULT_MONGO_CONNECTION_NAME}_CLIENT`;
}

/**
 * Get a token for the Mongo Db object for the given connection name
 * @param connectionName The unique name for the connection
 */
export function getDbToken() {
  return `${DEFAULT_MONGO_CONNECTION_NAME}_DB`;
}

/**
 * Get a token for the Mongo Db object for the given connection name
 * @param collectionName The unique name for the collection
 */
export function getCollectionToken(collectionName: string) {
  return `${collectionName}_COLLECTION`;
}

/**
 * Get a token for the Papr library
 */
export function getPaprToken() {
  return 'PAPR';
}
