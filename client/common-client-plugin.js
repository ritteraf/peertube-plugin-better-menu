function register ({ registerHook, peertubeHelpers }) {
  registerHook({
    target: 'filter:left-menu.links.create.result',
    handler: async (defaultLinks) => {
      const { enabled, items } = await peertubeHelpers.getSettings();

      if (!enabled) return defaultLinks;

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
        ...defaultLinks,
        itemSections
      ];
    },
  });
}

export {
  register
}
