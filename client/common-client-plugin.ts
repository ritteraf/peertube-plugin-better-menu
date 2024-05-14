import { RegisterClientOptions } from '@peertube/peertube-types/client'
import { MenuItem } from '../shared/constants';

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
      const { enabled, items } = await peertubeHelpers.getSettings() as { enabled: boolean, items: string };

      if (!enabled) return defaultLinks;

      const filteredLinks = defaultLinks.map((section) => ({
        ...section,
        links: section.links.filter((link) => enabledMenuItems[section.key].some((l) => l === link.path))
      }))

      const itemSections = items.trim().split('\n\n')
        .reduce((acc, val) => {
          const [header, ...links] = val.split('\n');

          return {
            key: header.toLowerCase().replace(' ', '-'),
            title: header,
            links: links.filter(l => l).map(link => {
              const [, href] = /\(([^)]+)\)/.exec(link) || [];
              const [, label] = link.match(/\[(.*?)\]/) || [];

              return {
                icon: '',
                label,
                path: href,
                shortLabel: label
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
