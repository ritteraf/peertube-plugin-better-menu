// Define the Params type
export type Params = {
  [key: string]: string | string[];
};

// This is for a single menu link
export interface MenuItem {
  icon?: string;
  iconClass?: string;
  label: string;
  path?: string;
  url?: string;
  query?: Params;
  isPrimaryButton?: boolean;
  showIfLoggedIn?: boolean;
}

// (Optional) If you want to keep sections, define a separate type:
export interface MenuSection {
  key: string;
  title: string;
  links: MenuItem[];
}

export const CORE_LINKS = [
  {
    key: 'home',
    label: 'Home',
    icon: 'home',
    path: '/',
    default: true
  },
  {
    key: 'subscriptions',
    label: 'Subscriptions',
    icon: 'subscriptions',
    path: '/videos/subscriptions',
    default: true
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: 'config',
    path: '/admin/settings',
    default: true
  },
  {
    key: 'admin-overview',
    label: 'Admin Overview',
    icon: 'overview',
    path: '/admin/overview',
    default: true
  }
  // Add more as needed
];

export const DEFAULT_MENU_ITEMS = {
  'in-my-library': [
    {
      key: 'video-channels',
      label: 'Channels',
      icon: 'channel',
      path: '/my-library/video-channels'
    },
    {
      key: 'videos',
      label: 'Videos',
      icon: 'videos',
      path: '/my-library/videos'
    },
    {
      key: 'video-playlists',
      label: 'Playlists',
      icon: 'playlists',
      path: '/my-library/video-playlists'
    },
    {
      key: 'subscriptions',
      label: 'Subscriptions',
      icon: 'subscriptions',
      path: '/videos/subscriptions'
    },
    {
      key: 'history-videos',
      label: 'History',
      icon: 'history',
      path: '/my-library/history/videos'
    }
  ],
  'on-instance': [
    {
      key: 'overview',
      label: 'Overview',
      icon: 'overview',
      path: '/videos/overview'
    },
    {
      key: 'trending',
      label: 'Trending',
      icon: 'trending',
      path: '/videos/trending'
    },
    {
      key: 'recently-added',
      label: 'Recently Added',
      icon: 'share',
      path: '/videos/recently-added'
    },
    {
      key: 'local',
      label: 'Local',
      icon: 'local',
      path: '/videos/local'
    }
  ]
};