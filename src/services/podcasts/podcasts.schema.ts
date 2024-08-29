// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { PodcastsService } from './podcasts.class'

// Main data model schema
export const podcastsSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    text: Type.String()
  },
  { $id: 'Podcasts', additionalProperties: false }
)
export type Podcasts = Static<typeof podcastsSchema>
export const podcastsValidator = getValidator(podcastsSchema, dataValidator)
export const podcastsResolver = resolve<Podcasts, HookContext<PodcastsService>>({})

export const podcastsExternalResolver = resolve<Podcasts, HookContext<PodcastsService>>({})

// Schema for creating new entries
export const podcastsDataSchema = Type.Pick(podcastsSchema, ['text'], {
  $id: 'PodcastsData'
})
export type PodcastsData = Static<typeof podcastsDataSchema>
export const podcastsDataValidator = getValidator(podcastsDataSchema, dataValidator)
export const podcastsDataResolver = resolve<Podcasts, HookContext<PodcastsService>>({})

// Schema for updating existing entries
export const podcastsPatchSchema = Type.Partial(podcastsSchema, {
  $id: 'PodcastsPatch'
})
export type PodcastsPatch = Static<typeof podcastsPatchSchema>
export const podcastsPatchValidator = getValidator(podcastsPatchSchema, dataValidator)
export const podcastsPatchResolver = resolve<Podcasts, HookContext<PodcastsService>>({})

// Schema for allowed query properties
export const podcastsQueryProperties = Type.Pick(podcastsSchema, ['_id', 'text'])
export const podcastsQuerySchema = Type.Intersect(
  [
    querySyntax(podcastsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type PodcastsQuery = Static<typeof podcastsQuerySchema>
export const podcastsQueryValidator = getValidator(podcastsQuerySchema, queryValidator)
export const podcastsQueryResolver = resolve<PodcastsQuery, HookContext<PodcastsService>>({})
