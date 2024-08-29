// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Podcasts, PodcastsData, PodcastsPatch, PodcastsQuery, PodcastsService } from './podcasts.class'

export type { Podcasts, PodcastsData, PodcastsPatch, PodcastsQuery }

export type PodcastsClientService = Pick<
  PodcastsService<Params<PodcastsQuery>>,
  (typeof podcastsMethods)[number]
>

export const podcastsPath = 'podcasts'

export const podcastsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const podcastsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(podcastsPath, connection.service(podcastsPath), {
    methods: podcastsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [podcastsPath]: PodcastsClientService
  }
}
