// Define the Params type
export type Params = {
  [key: string]: string | string[];
};

export interface MenuItem {
  key: string;
  title: string;
  links: {
    icon?: string; // Icon name for the link
    iconClass?: string; // Optional CSS class for the icon
    label: string; // Label for the link
    path?: string; // Optional path for the link
    url?: string; // Optional URL for the link
    query?: Params; // Allow query to be a string or a Params object
    isPrimaryButton?: boolean; // Optional flag to indicate if it's a primary button (default: false)
  }[];
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
};