'use client'

import { compile } from 'html-to-text'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { parseTime } from '~/app/(audio)/AudioPlayer'
import { type AudioData, useAudioPlayer } from '~/app/(audio)/AudioProvider'
import { PlayButton } from '~/app/(audio)/PlayButton'
import { formatTime } from '~/app/(audio)/Slider'
import { Container } from '~/app/[locale]/Container'
import { FormattedDate } from '~/app/[locale]/podcast/[id]/FormattedDate'

const compiler = compile()

export function EpisodePage({ episode, id }: { episode: Episode; id: number }) {
  const date = new Date(episode.published)

  const audioPlayerData: AudioData = useMemo(
    () => ({
      title: episode.title,
      audio: {
        src: episode.enclosure.url,
        type: episode.enclosure.type,
        coverArt: episode.coverArt,
      },
      link: `/podcast/${id}/${episode.id}`,
    }),
    [episode, id]
  )
  const player = useAudioPlayer(episode.enclosure ? audioPlayerData : undefined)
  const t = useTranslations('EpisodePage')

  return (
    <article className="py-16 lg:py-36">
      <Container>
        <header className="relative flex flex-col">
          <Link
            href={`/podcast/${id}`}
            className="absolute -top-10 left-0 flex w-full items-center text-sm text-stone-400 hover:text-stone-500 dark:text-neutral-500 dark:hover:text-neutral-400"
          >
            <ChevronLeftIcon className="mr-1 h-4 w-4" />
            {t('other_episodes')}
          </Link>
          <div className="flex items-center gap-6 pt-2">
            <PlayButton player={player} size="large" className="mt-5" />
            <div className="flex flex-col">
              <h1 className="mt-2 text-4xl font-bold text-stone-900 dark:text-neutral-100">
                {episode.title}
              </h1>
              <div className="order-first">
                <span className="rounded-lg border px-2 py-1 font-mono text-xs text-stone-500 dark:text-neutral-500">
                  {formatTime(parseTime(episode.duration))}
                </span>
                <FormattedDate
                  date={date}
                  className="pl-2 font-mono text-sm leading-7 text-stone-500 dark:text-neutral-500"
                />
              </div>
            </div>
          </div>
          <p className="ml-24 mt-3 line-clamp-3 text-lg font-medium leading-8 text-stone-500 dark:text-neutral-500">
            {compiler(episode.description)}
          </p>
        </header>
        <hr className="my-12 border-gray-200 dark:border-neutral-800" />
        <div
          className="prose prose-slate mt-14 dark:prose-invert [&>h2:nth-of-type(3n)]:before:bg-violet-200 dark:[&>h2:nth-of-type(3n)]:before:bg-violet-500 [&>h2:nth-of-type(3n+2)]:before:bg-indigo-200 dark:[&>h2:nth-of-type(3n+2)]:before:bg-indigo-500 [&>h2]:mt-12 [&>h2]:flex [&>h2]:items-center [&>h2]:text-sm [&>h2]:font-medium [&>h2]:leading-7 [&>h2]:text-stone-900 [&>h2]:before:mr-3 [&>h2]:before:h-3 [&>h2]:before:w-1.5 [&>h2]:before:rounded-r-full [&>h2]:before:bg-blue-300 dark:[&>h2]:text-neutral-200 dark:[&>h2]:before:bg-blue-400 [&>ul]:mt-6 [&>ul]:list-['\2013\20'] [&>ul]:pl-5"
          dangerouslySetInnerHTML={{
            __html: episode.content ?? episode.description,
          }}
        />
      </Container>
    </article>
  )
}
