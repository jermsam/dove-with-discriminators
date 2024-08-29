// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Podcasts, PodcastsData, PodcastsPatch, PodcastsQuery } from './podcasts.schema'

export type { Podcasts, PodcastsData, PodcastsPatch, PodcastsQuery }

export interface PodcastsParams extends MongoDBAdapterParams<PodcastsQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class PodcastsService<ServiceParams extends Params = PodcastsParams> extends MongoDBService<
  Podcasts,
  PodcastsData,
  PodcastsParams,
  PodcastsPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('podcasts'))
  }
}
