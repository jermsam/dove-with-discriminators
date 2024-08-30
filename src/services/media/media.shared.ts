// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Media, MediaData, MediaPatch, MediaQuery, MediaService } from './media.class'

export type { Media, MediaData, MediaPatch, MediaQuery }

export type MediaClientService = Pick<MediaService<Params<MediaQuery>>, (typeof mediaMethods)[number]>

export const mediaPath = 'media'

export const mediaMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const mediaClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(mediaPath, connection.service(mediaPath), {
    methods: mediaMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [mediaPath]: MediaClientService
  }
}
