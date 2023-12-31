type RootParams = { locale: 'en' | 'zh-CN' }

// Use type safe message keys with `next-intl`
type Messages = typeof import('~/messages/en.json')
declare interface IntlMessages extends Messages {}

type Platform = {
  name: string
  link: string
}

type PodcastConfig = {
  platforms: Platform[]
  hosts: Host[]
  info: Podcast
}

type Podcast = {
  title: string
  description: string
  link: string
  coverArt: string
  rssUrl: string
  itunesId: number
}

type Episode = {
  id: string
  title: string
  description: string
  link: string
  published: number
  content: string
  duration: number
  coverArt?: string
  enclosure: {
    url: string
    type: string
    length: number
  }
}

type Host = {
  name: string
  link: string
}

type ComponentProps<P = {}> = PropsWithChildren<
  {
    className?: string
  } & P
>
