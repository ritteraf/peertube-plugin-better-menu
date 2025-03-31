import { RegisterServerOptions } from '@peertube/peertube-types'
import { DEFAULT_MENU_ITEMS } from '../shared/constants'

async function register ({
  registerSetting
}: RegisterServerOptions) {
  registerSetting({
    name: 'enabled',
    label: 'Enable plugin',
    type: 'input-checkbox',
    default: false,
    private: false,
  });

  registerSetting({
    name: 'hideIfLoggedIn',
    label: 'Hide your custom left menu sections/links if logged in.',
    type: 'input-checkbox',
    default: false,
    private: false,
  });

  registerSetting({
    name: 'showButtonIfLive',
    label: 'Show a custom left menu link if any user is live on your instance.',
    type: 'input-checkbox',
    default: true,
    private: false,
  });

  (Object.keys(DEFAULT_MENU_ITEMS) as Array<'on-instance' | 'in-my-library'>).map((key) =>
    DEFAULT_MENU_ITEMS[key].forEach((path: string) =>
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
My First Section
[label:My External Link] [destination:https://example.com/videos/watch/12345] [icon:video] [iconClass:custom-icon-class] [isPrimaryButton:true]
[label:My Internal Link] [destination:/videos/browse?categoryOneOf=19&sort=-publishedAt] [icon:home] [iconClass:custom-icon-class] [isPrimaryButton:false]

My Second Section
[destination:/videos/trending] [label:Trending Videos] [icon:trending]
[destination:/videos/recently-added] [label:Recently Added] [icon:share]
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
