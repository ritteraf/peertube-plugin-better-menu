async function register ({
  registerSetting
}) {
  registerSetting({
    name: 'enabled',
    label: 'Enable plugin',
    type: 'input-checkbox',
    default: false,
    private: false,
  });

  const menuItems = {
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

  Object.keys(menuItems).map((key) =>
      menuItems[key].forEach((path) =>
        registerSetting({
          name: `menu-item-${key}__${path}`,
          label: `Display ${key} - ${path}`,
          type: 'input-checkbox',
          default: true,
          private: false
        })
      )
    )

  const defaultItems = `
Custom section
[First item](https://joinpeertube.org)
`;

  registerSetting({
    name: 'items',
    label: 'Items',
    type: 'input-textarea',
    default: defaultItems,
    private: false,
  });
}

async function unregister () {
  return
}

module.exports = {
  register,
  unregister
}
