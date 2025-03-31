# Better Menu for PeerTube

Better menu is an update to the menu-items plugin created by Kontrollanten at:
https://framagit.org/kontrollanten/peertube-plugin-menu-item

In the 7.1.0 release, PeerTube added the ability to add external links into menu items. This plugin was created to take advantage of that, plus a few more features

For our use case, we wanted the ability to populate the left menu with relevant links for visitors to the site, as the left menu is all but useless unless a user is logged in. However, we did not want to crowd the left menu with unwanted links when a site user logged in.

## Features
1. Add your own custom left menu section and links (Internal or External Link)
2. Remove unwanted system generated left menu links
3. Conditionally show a "Live Now!" button in the left menu, if any user on your instance is live
4. Conditionally hide your custom left menu links if a user is logged in

## Usage
1. Install plugin
2. Go to plugin settings
3. Enable the plugin, choose your settings, and add your own custom sections.

## Example custom section:
```
My First Section
[label:My External Link] [destination:https://example.com/videos/watch/12345] [icon:video] [iconClass:custom-icon-class] [isPrimaryButton:true]
[label:My Internal Link] [destination:/videos/browse?categoryOneOf=19&sort=-publishedAt] [icon:home] [iconClass:custom-icon-class] [isPrimaryButton:false]

My Second Section
[destination:/videos/trending] [label:Trending Videos] [icon:trending]
[destination:/videos/recently-added] [label:Recently Added] [icon:share]
```
## Icons Choices:
the [icon:] parameter can specify any icon that is currently included in the PeerTube package. That list is available at:
https://github.com/Chocobozzz/PeerTube/blob/develop/client/src/app/shared/shared-icons/global-icon.component.ts

To use your own icon istead of a built-in PeerTube icon, specify your own custom iconClass and use CSS to achieve the desired result.
