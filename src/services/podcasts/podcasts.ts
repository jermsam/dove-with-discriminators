// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  podcastsDataValidator,
  podcastsPatchValidator,
  podcastsQueryValidator,
  podcastsResolver,
  podcastsExternalResolver,
  podcastsDataResolver,
  podcastsPatchResolver,
  podcastsQueryResolver
} from './podcasts.schema'

import type { Application } from '../../declarations'
import { PodcastsService, getOptions } from './podcasts.class'
import { podcastsPath, podcastsMethods } from './podcasts.shared'

export * from './podcasts.class'
export * from './podcasts.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const podcasts = (app: Application) => {
  // Register our service on the Feathers application
  app.use(podcastsPath, new PodcastsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: podcastsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(podcastsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(podcastsExternalResolver),
        schemaHooks.resolveResult(podcastsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(podcastsQueryValidator),
        schemaHooks.resolveQuery(podcastsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(podcastsDataValidator),
        schemaHooks.resolveData(podcastsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(podcastsPatchValidator),
        schemaHooks.resolveData(podcastsPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [podcastsPath]: PodcastsService
  }
}
