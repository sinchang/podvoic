import { compile } from 'html-to-text'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { EpisodePage } from '~/app/[locale]/podcast/[id]/[episode]/EpisodePage'
import { getOpenGraphImage } from '~/app/getOpenGraphImage'
import { getPodcastEpisode } from '~/podcast.config'

export async function generateMetadata({
  params,
}: {
  params: { episode: string; locale: string; id: number }
}) {
  const data = await getPodcastEpisode(params.episode, params.id)
  if (!data) {
    return {}
  }

  const description = compile()(data.description).split('\n').join(' ')

  return {
    title: data.title,
    description,
    openGraph: {
      title: data.title,
      description,
      locale: params.locale,
      type: 'website',
      images: data.coverArt ? [getOpenGraphImage(data.coverArt)] : undefined,
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  } satisfies Metadata
}

export default async function ServerEpisodePage({
  params: { episode, id },
}: {
  params: { episode: string; id: number }
}) {
  const data = await getPodcastEpisode(episode, id)
  if (!data) {
    notFound()
  }

  return <EpisodePage episode={data} id={id} />
}

export const revalidate = 10
