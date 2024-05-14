async function register ({ registerHook, peertubeHelpers }) {
  const settings = await peertubeHelpers.getSettings()
  const enabledMenuItems = Object.keys(settings)
    .filter((setting) => setting.startsWith('menu-item-'))
    .reduce((acc, val) => {
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
    handler: async (defaultLinks) => {
      const { enabled, items } = await peertubeHelpers.getSettings();

      if (!enabled) return defaultLinks;

      const filteredLinks = defaultLinks.map((section) => ({
        ...section,
        links: section.links.filter((link) => enabledMenuItems[section.key].some((l) => l === link.path))
      }))

      const itemSections = items.split('\n\n')
        .reduce((acc, val) => {
          const [header, ...links] = val.split('\n');

          return {
            key: header.toLowerCase().replace(' ', '-'),
            title: header,
            links: links.filter(l => l).map(link => {
              const href = /\(([^)]+)\)/.exec(link)[1];
              const label = link.match(/\[(.*?)\]/)[1];

              return {
                icon: '',
                label,
                path: href,
                shortLabel: label
              };
            }),
          };
        }, null);

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
