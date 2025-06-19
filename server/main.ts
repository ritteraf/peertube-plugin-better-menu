import { RegisterServerOptions } from '@peertube/peertube-types'

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
    name: 'showButtonIfLive',
    label: 'Show a custom left menu link if any user is live on your instance.',
    type: 'input-checkbox',
    default: true,
    private: false,
  });

  registerSetting({
    name: 'hideDefaultLinks',
    label: 'Hide PeerTube system default menu links (for non-logged in users).',
    type: 'input-checkbox',
    default: false,
    private: false,
  });

  const defaultItems = `
My First Section
[label:My External Link] [destination:https://example.com/videos/watch/12345] [icon:videos] [iconClass:custom-icon-class] [isPrimaryButton:true] [showIfLoggedIn:true]
[label:My Internal Link] [destination:/videos/browse?categoryOneOf=19&sort=-publishedAt] [icon:home] [iconClass:custom-icon-class] [isPrimaryButton:false] [showIfLoggedIn:false]

My Second Section
[destination:/videos/trending] [label:Trending Videos] [icon:trending] [showIfLoggedIn:true]
[destination:/videos/recently-added] [label:Recently Added] [icon:share] [showIfLoggedIn:false]
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
