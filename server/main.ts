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
    label: 'Hide Extra Menu Items If User Is Logged In',
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
Section Title
[Link 1 Label] [url:https://example.com] [icon:external-link] [iconClass:my-class] [isPrimaryButton:false]
[Link 2 Label] [url:https://example.com] [icon:external-link] [iconClass:my-class] [isPrimaryButton:true]
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
