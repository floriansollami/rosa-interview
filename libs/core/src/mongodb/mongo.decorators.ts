import { Inject } from '@nestjs/common';
import {
  getClientToken,
  getCollectionToken,
  getDbToken,
  getPaprToken,
} from './mongo.util';

/**
 * Inject the MongoClient object associated with a connection
 */
export const InjectClient = () => Inject(getClientToken());

/**
 * Inject the Mongo Db object associated with a connection
 */
export const InjectDb = () => Inject(getDbToken());

/**
 * Inject the Mongo Collection object associated with a Db
 * @param collectionName The unique name associated with the collection
 */
export const InjectCollection = (collectionName: string) =>
  Inject(getCollectionToken(collectionName));

/**
 * Inject the Papr library
 */
export const InjectPapr = () => Inject(getPaprToken());
