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
