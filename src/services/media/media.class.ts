// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Media, MediaData, MediaPatch, MediaQuery } from './media.schema'

export type { Media, MediaData, MediaPatch, MediaQuery }

export interface MediaParams extends MongoDBAdapterParams<MediaQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class MediaService<ServiceParams extends Params = MediaParams> extends MongoDBService<
  Media,
  MediaData,
  MediaParams,
  MediaPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient')
      .then((db) => db.collection('media'))
      .then((collection) => {
        collection.createIndex({_id: 1}, {unique: true});

        return collection;
      })
  }
}
