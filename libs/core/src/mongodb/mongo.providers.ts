import { Db } from 'mongodb';
import { getCollectionToken, getDbToken } from './mongo.util';

export function createMongoProviders(collections: string[] = []) {
  return collections.map((collectionName) => {
    return {
      provide: getCollectionToken(collectionName.toUpperCase()),
      useFactory: (db: Db) => db.collection(collectionName),
      inject: [getDbToken()],
    };
  });
}
