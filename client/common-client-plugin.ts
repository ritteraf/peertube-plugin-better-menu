import { RegisterClientOptions } from '@peertube/peertube-types/client'
import { DEFAULT_MENU_ITEMS, MenuItem } from '../shared/constants';

async function register ({ registerHook, peertubeHelpers }: RegisterClientOptions) {
  const settings = await peertubeHelpers.getSettings()
  const enabledMenuItems = Object.keys(settings)
    .filter((setting) => setting.startsWith('menu-item-'))
    .reduce((acc: { [key: string]: string[] }, val) => {
      if (settings[val] === false) return acc

      const [group, path] = val.substring('menu-item-'.length).split('__')

      return {
        ...acc,
        [group]: [
          ...(acc[group] || []),
          path
        ]
      }
    }, {})

  registerHook({
    target: 'filter:left-menu.links.create.result',
    handler: async (defaultLinks: MenuItem[]) => {
      const { enabled, items, hideIfLoggedIn } = await peertubeHelpers.getSettings() as { enabled: boolean, items: string, hideIfLoggedIn: boolean };
      console.log('3');
      console.log('hideIfLoggedIn:', hideIfLoggedIn);
      console.log('isLoggedIn:', peertubeHelpers.isLoggedIn());
      console.log('defaultLinks:', defaultLinks);

      if (!enabled) return defaultLinks;

      if (hideIfLoggedIn && peertubeHelpers.isLoggedIn()) {
        // If the user is logged in and hideIfLoggedIn is true, return the default items
        return defaultLinks;
      }

      const filteredLinks = defaultLinks.map((section) => ({
        ...section,
        links: section.links.filter((link) => {
          if (Object.keys(DEFAULT_MENU_ITEMS).includes(section.key) === false) {
            // Keep links added by other plugins
            return true;
          }

          if ((DEFAULT_MENU_ITEMS[section.key as keyof typeof DEFAULT_MENU_ITEMS] || []).includes(link.path || '') === false) {
            // Keep links added by other plugins
            return true;
          }

          return enabledMenuItems[section.key].some((l) => l === link.path);
        }),
      }));

      const itemSections = items.trim().split('\n\n')
        .reduce((acc, val) => {
          const [header, ...links] = val.split('\n');

          return {
            key: header.toLowerCase().replace(' ', '-'),
            title: header,
            links: links.filter(l => l).map(link => {
              const [, path] = link.match(/\[path:([^\]]+)\]/) || []; // Extract path
              const [, url] = link.match(/\[url:([^\]]+)\]/) || []; // Extract URL
              const [, label] = link.match(/\[(.*?)\]/) || []; // Extract label
              const [, icon] = link.match(/\[icon:([^\]]+)\]/) || []; // Extract icon
              const [, iconClass] = link.match(/\[iconClass:([^\]]+)\]/) || []; // Extract iconClass
              const [, isPrimaryButton] = link.match(/\[isPrimaryButton:(true|false)\]/) || []; // Extract isPrimaryButton

              // Validation: Ensure either path or url is provided, but not both
              if ((path && url) || (!path && !url)) {
                throw new Error(`Invalid link configuration: Provide either a path or a URL, but not both. Link: ${link}`);
              }

              return {
                icon: icon || 'home', // Default to 'default-icon' if not provided
                iconClass: iconClass || undefined, // Explicitly set to undefined if not provided
                label: label,
                path: path || undefined, // Set path if provided
                url: url || undefined, // Set url if provided
                isPrimaryButton: isPrimaryButton === 'true', // Convert string to boolean, default to false
              };
            }),
          };
        }, null as MenuItem | null);

      return [
        ...filteredLinks,
        itemSections
      ];
    },
  });
}

export {
  register
}
