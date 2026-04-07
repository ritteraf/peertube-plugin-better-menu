import { RegisterClientOptions } from '@peertube/peertube-types/client';
import { MenuItem, MenuSection, Params } from '../shared/constants';

async function register({ registerHook, peertubeHelpers }: RegisterClientOptions) {

  registerHook({
    target: 'filter:left-menu.links.create.result',
    handler: async (defaultLinks: MenuSection[]) => {
      const { enabled, items, showButtonIfLive, hideDefaultLinks } = (await peertubeHelpers.getSettings()) as {
        enabled: boolean;
        items: string;
        showButtonIfLive: boolean;
        hideDefaultLinks: boolean;
      };

      console.debug('[BetterMenu] Settings:', { enabled, items, showButtonIfLive, hideDefaultLinks });

      // Debug: Log the defaultLinks received from PeerTube
      console.debug('[BetterMenu] PeerTube provided defaultLinks:', defaultLinks);

      if (!enabled) {
        console.debug('[BetterMenu] Plugin not enabled, returning defaultLinks.');
        return defaultLinks;
      }

      const isLoggedIn = peertubeHelpers.isLoggedIn();
      console.debug('[BetterMenu] User logged in:', isLoggedIn);

      const sections: MenuSection[] = [];

      // Add "Live Now" as its own section if needed
      if (showButtonIfLive) {
        try {
          const response = await fetch(`${window.location.origin}/api/v1/videos?isLive=true`);
          if (response.ok) {
            const liveData = await response.json();
            console.debug('[BetterMenu] Live data:', liveData);
            if (liveData.total > 0) {
              let pathToReturn: string = '';
              let queryToReturn: Params | undefined = undefined;

              if (liveData.total === 1) {
                const fullUrl = liveData.data[0].url;
                const urlObject = new URL(fullUrl);
                pathToReturn = urlObject.pathname;
                queryToReturn = urlObject.search
                  .substring(1)
                  .split('&')
                  .filter(Boolean)
                  .reduce((acc, param) => {
                    const [key, value] = param.split('=');
                    if (key) acc[key] = decodeURIComponent(value || '');
                    return acc;
                  }, {} as Params);
              } else {
                pathToReturn = `/videos/browse`;
                queryToReturn = { live: 'true' };
              }

              const liveSection = {
                key: 'live-now',
                title: 'Live Now',
                links: [{
                  icon: 'live',
                  label: 'Live Now!',
                  path: pathToReturn,
                  query: queryToReturn,
                  isPrimaryButton: true
                }]
              };
              sections.push(liveSection);
              console.debug('[BetterMenu] Live Now section created:', liveSection);
            }
          } else {
            console.warn('[BetterMenu] Failed to fetch live videos:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('[BetterMenu] Error fetching live videos:', error);
        }
      }

      // Parse user-defined sections and links into MenuSection[]
      // Group lines into sections: any line not starting with '[' begins a new section
      const lines = items.replace(/\r\n?/g, '\n').trim().split('\n').filter((l) => l.trim());
      const rawSections: { header: string; links: string[] }[] = [];
      for (const line of lines) {
        if (!line.trimStart().startsWith('[')) {
          rawSections.push({ header: line.trim(), links: [] });
        } else if (rawSections.length > 0) {
          rawSections[rawSections.length - 1].links.push(line);
        }
      }

      const userSections: MenuSection[] = rawSections
        .map((val, idx) => {
          const { header, links } = val;
          console.debug(`[BetterMenu] Parsing section ${idx}:`, header);

          const menuLinks: MenuItem[] = links
            .map((link, linkIdx) => {
              const [, destination] = link.match(/\[destination:([^\]]+)\]/) || [];
              const [, label] = link.match(/\[label:([^\]]+)\]/) || [];
              const [, icon] = link.match(/\[icon:([^\]]+)\]/) || [];
              const [, iconClass] = link.match(/\[iconClass:([^\]]+)\]/) || [];
              const [, isPrimaryButton] = link.match(/\[isPrimaryButton:(true|false)\]/) || [];
              const [, showIfLoggedIn] = link.match(/\[showIfLoggedIn:(true|false)\]/) || [];

              // Visibility logic
              if (showIfLoggedIn !== undefined) {
                if (showIfLoggedIn === 'true' && !isLoggedIn) {
                  console.debug(`[BetterMenu] Link ${linkIdx} in section ${idx} hidden (requires logged in)`);
                  return null;
                }
                if (showIfLoggedIn === 'false' && isLoggedIn) {
                  console.debug(`[BetterMenu] Link ${linkIdx} in section ${idx} hidden (requires logged out)`);
                  return null;
                }
              }

              let path: string | undefined = undefined;
              let url: string | undefined = undefined;
              let query: Params | undefined = undefined;

              if (destination) {
                if (destination.startsWith('http://') || destination.startsWith('https://')) {
                  url = destination;
                } else {
                  const [pathPart, queryString] = destination.split('?');
                  path = pathPart;
                  if (queryString) {
                    query = queryString.split('&').reduce((acc, param) => {
                      const [key, value] = param.split('=');
                      if (!key) return acc;
                      acc[key] = value || '';
                      return acc;
                    }, {} as Params);
                  }
                }
              }

              const menuItem = {
                icon: icon || undefined,
                iconClass: iconClass || undefined,
                label: label || 'My Link',
                path,
                url,
                query,
                isPrimaryButton: isPrimaryButton === 'true',
              };
              console.debug(`[BetterMenu] Created menu item in section ${idx}:`, menuItem);
              return menuItem;
            })
            .filter(isMenuLink) as MenuItem[];

          const section = {
            key: header.toLowerCase().replace(/\s+/g, '-'),
            title: header,
            links: menuLinks
          };
          console.debug(`[BetterMenu] Created user section ${idx}:`, section);
          return section;
        })
        .filter(section => section.links.length > 0); // <-- Only keep sections with links

      // Add user sections
      sections.push(...userSections);

      const shouldHideDefaultLinks = hideDefaultLinks && !isLoggedIn;

      // Merge PeerTube's default menu sections (unless hidden) with plugin sections
      const mergedSections: MenuSection[] = [
        ...(!shouldHideDefaultLinks ? (defaultLinks as MenuSection[]) : []),
        ...sections
      ];

      console.debug('[BetterMenu] Final merged menu sections:', mergedSections);

      return mergedSections;
    },
  });
}

function isMenuLink(link: unknown): link is MenuItem {
  return !!link && typeof link === 'object' && 'label' in link;
}

export { register };
