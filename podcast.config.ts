import getPodcastPlatformLinks from 'podcast-platform-links'
import PodcastIndexClient from 'podcastdx-client'
import { cache } from 'react'

const client = new PodcastIndexClient({
  key: process.env.PODCAST_INDEX_API_KEY,
  secret: process.env.PODCAST_INDEX_API_SECRET,
  disableAnalytics: true,
})

export const getPodcastConfig = cache(async (itunesId: number) => {
  const { feed } = await client.podcastByItunesId(itunesId)
  const platforms = getPodcastPlatformLinks(itunesId, feed.url)
  return {
    platforms: [
      ...platforms.map((platform) => ({
        name: platform.platform,
        link: platform.link,
      })),
      {
        name: 'RSS',
        link: feed.url,
      },
    ],
    hosts: [
      {
        name: feed.author,
        link: feed.link,
      },
    ],
    info: {
      title: feed.title,
      description: feed.description,
      link: feed.link,
      coverArt: feed.image,
      rssUrl: feed.url,
      itunesId: feed.itunesId,
    },
  } as PodcastConfig
})

/**
 * Encode episode id.
 * (Certain episode id contains special characters that are not allowed in URL)
 */
function encodeEpisodeId(raw: string): string {
  if (!raw.startsWith('http')) {
    return raw
  }

  const url = new URL(raw)
  const path = url.pathname.split('/')
  const lastPathname = path[path.length - 1]

  if (lastPathname === '' && url.search) {
    return url.search.slice(1)
  }

  return lastPathname
}

/**
 * Get podcast episodes via RSS feed.
 */
export const getPodcastEpisodes = cache(async (itunesId: number) => {
  const { items } = await client.episodesByItunesId(itunesId)
  const episodes: Episode[] = items.map((item) => ({
    id: encodeEpisodeId(item.id ? String(item.id) : item.link),
    title: item.title,
    description: item.description,
    link: item.link,
    published: item.datePublished * 1000,
    content: item.description,
    duration: item.duration,
    enclosure: {
      url: item.enclosureUrl,
      type: item.enclosureType,
      length: item.enclosureLength,
    },
    coverArt: item.image,
  }))

  return episodes
})

/**
 * Get podcast episode by id.
 */
export const getPodcastEpisode = cache(async (episodeId: string, itunesId: number) => {
  const episodes = await getPodcastEpisodes(itunesId)
  const decodedId = decodeURIComponent(episodeId)
  return episodes.find(
    (episode) => episode.id === decodedId || episode.link.endsWith(decodedId)
  )
})
