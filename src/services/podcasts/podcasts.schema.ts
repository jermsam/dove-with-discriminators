// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { PodcastsService } from './podcasts.class'

// Main data model schema
export const   podcastsBaseSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    title: Type.String(),
    dateReleased: Type.Date(),
    redo: Type.Boolean(),
    type: Type.String(),  // Discriminator key
  },
  { $id: 'Podcasts', additionalProperties: false }
)

export const booksSchema = Type.Object(
  {
    author: Type.String(),
    type: Type.Literal('books'),
  },
  { $id: 'Books', additionalProperties: false }
)

export const musicSchema = Type.Object(
  {
    genre: Type.String(),
    artist: Type.String(),
    type: Type.Literal('music'),
  },
  { $id: 'Music', additionalProperties: false }
)

export const showSchema =  Type.Object(
  {
    season: Type.Number(),
    type: Type.Literal('shows'),
  },
  { $id: 'Shows', additionalProperties: false }
)

const podcastsSchema = Type.Union([booksSchema, musicSchema, showSchema]);
export type Podcasts = Static<typeof podcastsSchema>
export const podcastsValidator = getValidator(podcastsSchema, dataValidator)
export const podcastsResolver = resolve<Podcasts, HookContext<PodcastsService>>({})

export const podcastsExternalResolver = resolve<Podcasts, HookContext<PodcastsService>>({})

// Schema for creating new entries
export const podcastsBaseDataSchema = Type.Pick(podcastsBaseSchema, ['type','title','dateReleased','redo'], {
  $id: 'PodcastsData'
})

export const booksDataSchema = Type.Intersect([
  podcastsBaseDataSchema,  // Common fields
  Type.Pick(booksSchema, ['author'])  // Specific field from booksSchema
], {
  $id: 'BooksData'
});

export const musicDataSchema = Type.Intersect([
  podcastsBaseDataSchema,  // Common fields
  Type.Pick(musicSchema, ['genre','artist'])  // Specific field from booksSchema
], {
  $id: 'BooksData'
});

export const showDataSchema = Type.Intersect([
  podcastsBaseDataSchema,  // Common fields
  Type.Pick(showSchema, ['season'])  // Specific field from booksSchema
], {
  $id: 'BooksData'
});

export const podcastsDataSchema = Type.Union([
  booksDataSchema,
  musicDataSchema,
  showDataSchema
], { $id: 'PodcastsData' });

export type PodcastsData = Static<typeof podcastsDataSchema>
export const podcastsDataValidator = getValidator(podcastsDataSchema, dataValidator)
export const podcastsDataResolver = resolve<Podcasts, HookContext<PodcastsService>>({})

// Schema for updating existing entries
export const podcastsPatchSchema = Type.Partial(
  Type.Intersect([
    podcastsBaseSchema,
    Type.Intersect([
      Type.Partial(booksSchema),
      Type.Partial(musicSchema),
      Type.Partial(showSchema)
    ])
  ]), { $id: 'PodcastsPatch' }
)

export type PodcastsPatch = Static<typeof podcastsPatchSchema>
export const podcastsPatchValidator = getValidator(podcastsPatchSchema, dataValidator)
export const podcastsPatchResolver = resolve<Podcasts, HookContext<PodcastsService>>({})

// Schema for allowed query properties
const podcastsBaseQueryProperties = Type.Pick(podcastsBaseSchema, ['_id', 'title','dateReleased'])
const booksQueryProperties = Type.Pick(booksSchema, ['author'])
const musicQueryProperties = Type.Pick(musicSchema, ['genre','artist'])
const showsQueryProperties = Type.Pick(showSchema, ['season'])

export const podcastsQuerySchema = Type.Union([
  // Books
  querySyntax(Type.Intersect([
    podcastsBaseQueryProperties,
    Type.Object({ type: Type.Literal('books') }),
    booksQueryProperties
  ])),

  // Music
  querySyntax(Type.Intersect([
    podcastsBaseQueryProperties,
    Type.Object({ type: Type.Literal('music') }),
    musicQueryProperties
  ])),

  // Shows
  querySyntax(Type.Intersect([
    podcastsBaseQueryProperties,
    Type.Object({ type: Type.Literal('shows') }),
    showsQueryProperties
  ]))
], { additionalProperties: false })

export type PodcastsQuery = Static<typeof podcastsQuerySchema>
export const podcastsQueryValidator = getValidator(podcastsQuerySchema, queryValidator)
export const podcastsQueryResolver = resolve<PodcastsQuery, HookContext<PodcastsService>>({})
