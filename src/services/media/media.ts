// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  mediaDataValidator,
  mediaPatchValidator,
  mediaQueryValidator,
  mediaResolver,
  mediaExternalResolver,
  mediaDataResolver,
  mediaPatchResolver,
  mediaQueryResolver
} from './media.schema'

import type { Application } from '../../declarations'
import { MediaService, getOptions } from './media.class'
import { mediaPath, mediaMethods } from './media.shared'

export * from './media.class'
export * from './media.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const media = (app: Application) => {
  // Register our service on the Feathers application
  app.use(mediaPath, new MediaService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: mediaMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(mediaPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(mediaExternalResolver), schemaHooks.resolveResult(mediaResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(mediaQueryValidator), schemaHooks.resolveQuery(mediaQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(mediaDataValidator), schemaHooks.resolveData(mediaDataResolver)],
      patch: [schemaHooks.validateData(mediaPatchValidator), schemaHooks.resolveData(mediaPatchResolver)],
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
    [mediaPath]: MediaService
  }
}
