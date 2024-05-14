export interface MenuItem {
  key: string
  title: string
  links: {
    icon: string,
    label: string,
    path: string,
    shortLabel: string
  }[]
}

export const DEFAULT_MENU_ITEMS = {
    'in-my-library': [
      '/my-library/video-channels',
      '/my-library/videos',
      '/my-library/video-playlists',
      '/videos/subscriptions',
      '/my-library/history/videos'
    ],
    'on-instance': [
      '/videos/overview',
      '/videos/trending',
      '/videos/recently-added',
      '/videos/local'
    ]
  }