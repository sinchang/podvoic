'use client'

import { clsxm } from '@zolplay/utils'
import { compile } from 'html-to-text'
import { ActivityIcon, Mic2Icon, UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React, { Fragment, useEffect, useId, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { AudioPlayer } from '~/app/(audio)/AudioPlayer'
import { PodcastDirectoryLink } from '~/app/[locale]/podcast/[id]/PodcastDirectoryLink'
import { ThemeSwitcher } from '~/app/[locale]/ThemeSwitcher'

const compiler = compile()
function AboutSection(
  props: React.HTMLProps<HTMLElement> & { children: string }
) {
  const content = props.children
  const [isExpanded, setIsExpanded] = useState(false)
  const isTooLong = useMemo(() => content.length > 150, [content])
  const [mounted, setMounted] = useState(false)
  const t = useTranslations('Layout')

  useEffect(() => setMounted(true), [])

  return (
    <section {...props}>
      <h2 className="flex items-center text-sm font-medium leading-7 text-stone-900 dark:text-neutral-100">
        <ActivityIcon className="h-3 w-3 fill-stone-300 text-blue-500 dark:fill-neutral-600 dark:text-blue-400" />
        <span className="ml-2.5">{t('about')}</span>
      </h2>
      <div
        className={clsxm(
          'mt-2 text-base leading-7 text-stone-700 dark:text-neutral-400',
          !isExpanded && 'lg:line-clamp-4'
        )}
      >
        {mounted && (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ children, href }) => {
                return (
                  <Link
                    href={href ?? ''}
                    className="font-bold text-zinc-800 hover:underline dark:text-zinc-100"
                    target="_blank"
                  >
                    {children}
                  </Link>
                )
              },
            }}
          >
            {compiler(content)}
          </ReactMarkdown>
        )}
      </div>
      {!isExpanded && isTooLong && (
        <button
          type="button"
          className="mt-2 hidden text-sm font-bold leading-6 text-blue-500 hover:text-blue-700 active:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 dark:active:text-blue-100 lg:inline-block"
          onClick={() => setIsExpanded(true)}
        >
          {t('show_more')}
        </button>
      )}
    </section>
  )
}

export function PodcastLayout({
  children,
  podcastConfig,
}: {
  children: React.ReactNode
  podcastConfig: PodcastConfig
}) {
  const t = useTranslations('Layout')

  return (
    <>
      <header className="lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-112 lg:items-start lg:overflow-y-auto xl:w-120">
        <div className="relative z-10 mx-auto px-4 pb-4 pt-10 sm:px-6 md:max-w-2xl md:px-4 lg:min-h-full lg:flex-auto lg:border-x lg:border-stone-200 lg:px-8 lg:py-12 dark:lg:border-neutral-800 xl:px-12">
          <Link
            href={`/podcast/${podcastConfig.info.itunesId}`}
            className="relative mx-auto block w-48 overflow-hidden rounded-lg bg-stone-200 shadow-xl shadow-stone-200 dark:bg-neutral-800 dark:shadow-neutral-800 sm:w-64 sm:rounded-xl lg:w-auto lg:rounded-2xl"
            aria-label={t('homepage')}
          >
            <Image
              className="w-full"
              src={podcastConfig.info.coverArt}
              alt=""
              sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
              width={500}
              height={500}
              priority
              unoptimized
            />
            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 dark:ring-white/10 sm:rounded-xl lg:rounded-2xl" />
          </Link>
          <div className="mt-10 text-center lg:mt-12 lg:text-left">
            <p className="text-xl font-bold text-stone-900 dark:text-neutral-100">
              <Link href={`/podcast/${podcastConfig.info.itunesId}`}>
                {podcastConfig.info.title}
              </Link>
            </p>
          </div>
          <AboutSection className="mt-12 hidden lg:block">
            {podcastConfig.info.description}
          </AboutSection>
          <section className="mt-10 lg:mt-12">
            <h2 className="sr-only flex items-center text-sm font-medium leading-7 text-stone-900 dark:text-neutral-100 lg:not-sr-only">
              <Mic2Icon className="h-3 w-3 fill-stone-300 text-blue-500 dark:fill-neutral-600 dark:text-blue-400" />
              <span className="ml-2.5">{t('listen')}</span>
            </h2>
            <div className="h-px bg-gradient-to-r from-stone-200/0 via-stone-200 to-stone-200/0 dark:from-neutral-700/0 dark:via-neutral-700 dark:to-neutral-700/0 lg:hidden" />
            <ul
              role="list"
              className="mt-4 flex flex-wrap items-center justify-center gap-4 py-5 text-base font-medium leading-7 text-stone-700 dark:text-neutral-300 lg:justify-start lg:py-0"
            >
              {podcastConfig.platforms.map((platform, idx) => (
                <li key={platform.name} className="flex">
                  <PodcastDirectoryLink
                    platform={platform}
                  ></PodcastDirectoryLink>
                </li>
              ))}
            </ul>
          </section>
          <section className="mt-10 hidden lg:mt-12 lg:block">
            <h2 className="flex items-center text-sm font-medium leading-7 text-stone-900 dark:text-neutral-100">
              <UserIcon className="h-3 w-auto fill-stone-300 text-blue-500 dark:fill-neutral-600 dark:text-blue-400" />
              <span className="ml-2.5">{t('hosted_by')}</span>
            </h2>
            <div className="mt-2 flex gap-6 text-sm font-bold leading-7 text-stone-900">
              {podcastConfig.hosts.map((host, hostIndex) => (
                <Fragment key={host.name}>
                  {hostIndex !== 0 && (
                    <span
                      aria-hidden="true"
                      className="text-stone-400 dark:text-neutral-600"
                    >
                      /
                    </span>
                  )}
                  <Link
                    href={host.link ?? '/'}
                    target="_blank"
                    className="inline-flex items-center space-x-1.5 text-stone-900 dark:text-neutral-200"
                  >
                    <span>{host.name}</span>
                  </Link>
                </Fragment>
              ))}
            </div>
          </section>
        </div>
      </header>
      <main className="border-t border-stone-200 dark:border-neutral-800 lg:relative lg:mb-28 lg:ml-112 lg:border-t-0 xl:ml-120">
        <div className="relative">{children}</div>
      </main>
      <footer className="border-t border-stone-200 bg-stone-50 py-10 pb-40 dark:border-neutral-800 dark:bg-neutral-900 sm:py-16 sm:pb-32 lg:hidden">
        <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4">
          <AboutSection>{podcastConfig.info.description}</AboutSection>
          <h2 className="mt-8 flex items-center text-sm font-medium leading-7 text-stone-900 dark:text-neutral-100">
            <UserIcon className="h-3 w-auto fill-stone-300 text-blue-500 dark:fill-neutral-600 dark:text-blue-400" />
            <span className="ml-2.5">{t('hosted_by')}</span>
          </h2>
          <div className="mt-2 flex gap-6 text-sm font-bold leading-7 text-stone-900 dark:text-neutral-200">
            {podcastConfig.hosts?.map((host, hostIndex) => (
              <Fragment key={host.name}>
                {hostIndex !== 0 && (
                  <span
                    aria-hidden="true"
                    className="text-stone-400 dark:text-neutral-600"
                  >
                    /
                  </span>
                )}
                <Link
                  href={host.link ?? '/'}
                  target="_blank"
                  className="inline-flex items-center space-x-1.5"
                >
                  <span>{host.name}</span>
                </Link>
              </Fragment>
            ))}
          </div>
        </div>
      </footer>
      <div className="fixed inset-x-0 bottom-0 z-10 lg:left-112 xl:left-120">
        <AudioPlayer />
      </div>
    </>
  )
}
