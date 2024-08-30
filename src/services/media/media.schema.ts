// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { MediaService } from './media.class'

// Main data model schema
export const mediaBaseSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    _type: Type.String(),  // Discriminator key
    title: Type.String(),
  },
  { $id: 'Media', additionalProperties: false }
)


export const booksSchema = Type.Object(
  {
    author: Type.String(),
    _type: Type.Literal('books'),
  },
  { $id: 'Books', additionalProperties: false }
)

export const musicSchema = Type.Object(
  {
    genre: Type.String(),
    artist: Type.String(),
    _type: Type.Literal('music'),
  },
  { $id: 'Music', additionalProperties: false }
)

export const showSchema =  Type.Object(
  {
    season: Type.Number(),
    _type: Type.Literal('shows'),
  },
  { $id: 'Shows', additionalProperties: false }
)

// Discriminated union schema
export const mediaSchema = Type.Union([
  Type.Intersect([mediaBaseSchema, booksSchema]),
  Type.Intersect([mediaBaseSchema, musicSchema]),
  Type.Intersect([mediaBaseSchema, showSchema]),
], { $id: 'Media' });

export type Media = Static<typeof mediaSchema>
export const mediaValidator = getValidator(mediaSchema, dataValidator)
export const mediaResolver = resolve<Media, HookContext<MediaService>>({})

export const mediaExternalResolver = resolve<Media, HookContext<MediaService>>({})

// Schema for creating new entries

export const mediaBaseDataSchema = Type.Pick(mediaBaseSchema, ['title', '_type'], {
  $id: 'MediaBaseData'
});

export const mediaDataSchema = Type.Union([
  Type.Intersect([
    mediaBaseDataSchema,     // Common fields
    Type.Pick(booksSchema, ['author']) // Specific fields for books
  ]),
  Type.Intersect([
    mediaBaseDataSchema,     // Common fields
    Type.Pick(musicSchema, ['genre', 'artist']) // Specific fields for music
  ]),
  Type.Intersect([
    mediaBaseDataSchema,     // Common fields
    Type.Pick(showSchema, ['season']) // Specific fields for shows
  ]),
], { $id: 'MediaData' });

export type MediaData = Static<typeof mediaDataSchema>
export const mediaDataValidator = getValidator(mediaDataSchema, dataValidator)
export const mediaDataResolver = resolve<Media, HookContext<MediaService>>({})

// Schema for updating existing entries
export const mediaBasePatchSchema = Type.Partial(mediaBaseSchema,  {
  $id: 'MediaBasePatch'
});

export const mediaPatchSchema = Type.Union([
  Type.Intersect([
    mediaBasePatchSchema,     // Common fields
    Type.Partial(booksSchema) // Specific fields for books
  ]),
  Type.Intersect([
    mediaBasePatchSchema,    // Common fields
    Type.Partial(musicSchema) // Specific fields for music
  ]),
  Type.Intersect([
    mediaBasePatchSchema,     // Common fields
    Type.Partial(showSchema) // Specific fields for shows
  ]),
], {  $id: 'MediaPatch' });

// export const mediaPatchSchema = Type.Partial(mediaSchema, {
//   $id: 'MediaPatch'
// })
export type MediaPatch = Static<typeof mediaPatchSchema>
export const mediaPatchValidator = getValidator(mediaPatchSchema, dataValidator)
export const mediaPatchResolver = resolve<Media, HookContext<MediaService>>({})

// Schema for allowed query properties


export const mediaBaseQueryProperties = Type.Pick(mediaBaseSchema, ['_id', 'title'], {
  $id: 'MediaBaseQueryProperties'
});


export const mediaQueryProperties = Type.Union([
  Type.Intersect([
    mediaBaseQueryProperties,     // Common fields
    Type.Pick(booksSchema,['author']) // Specific fields for books
  ]),
  Type.Intersect([
    mediaBaseQueryProperties,    // Common fields
    Type.Pick(musicSchema,['genre','artist']) // Specific fields for music
  ]),
  Type.Intersect([
    mediaBaseQueryProperties,    // Common fields
    Type.Pick(showSchema,['season']) // Specific fields for shows
  ]),
], {  $id: 'MediaPatch' });

export const mediaQuerySchema = Type.Intersect(
  [
    querySyntax(Type.Object({
      ...mediaQueryProperties.properties
    },{additionalProperties: false})),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  {  }
)
export type MediaQuery = Static<typeof mediaQuerySchema>
export const mediaQueryValidator = getValidator(mediaQuerySchema, queryValidator)
export const mediaQueryResolver = resolve<MediaQuery, HookContext<MediaService>>({})
