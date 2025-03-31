import { RegisterClientOptions } from '@peertube/peertube-types/client';
import { DEFAULT_MENU_ITEMS, MenuItem, Params } from '../shared/constants'; // Import Params

async function register ({ registerHook, peertubeHelpers }: RegisterClientOptions) {
  const settings = await peertubeHelpers.getSettings();
  const enabledMenuItems = Object.keys(settings)
    .filter((setting) => setting.startsWith('menu-item-'))
    .reduce((acc: { [key: string]: string[] }, val) => {
      if (settings[val] === false) return acc;

      const [group, path] = val.substring('menu-item-'.length).split('__');

      return {
        ...acc,
        [group]: [...(acc[group] || []), path],
      };
    }, {});

  registerHook({
    target: 'filter:left-menu.links.create.result',
    handler: async (defaultLinks: MenuItem[]) => {
      const { enabled, items, hideIfLoggedIn, showButtonIfLive } = (await peertubeHelpers.getSettings()) as {
        enabled: boolean;
        items: string;
        hideIfLoggedIn: boolean;
        showButtonIfLive: boolean;
      };

      if (!enabled) return defaultLinks;

      if (hideIfLoggedIn && peertubeHelpers.isLoggedIn()) {
        // If the user is logged in and hideIfLoggedIn is true, return the default items
        return defaultLinks;
      }

      let isAnyUserLive = false;

      // Only check if any user is live if showButtonIfLive is true
      if (showButtonIfLive) {
        try {
          const response = await fetch(`${window.location.origin}/api/v1/videos?isLive=true`);
          if (!response.ok) {
            console.error('Failed to fetch live videos:', response.status, response.statusText);
            return defaultLinks;
          }

          const liveData = await response.json();
          isAnyUserLive = liveData.total > 0;
          console.log('Is any user live:', isAnyUserLive);

          // Add a default link if any user is live
          if (isAnyUserLive) {
            let pathToReturn: string = '';
            let queryToReturn: Params | undefined = undefined; // Define queryToReturn as Params

            if (liveData.total === 1) {
              // Only one user is live - extract the path and query parameters from the URL
              const fullUrl = liveData.data[0].url; // Full URL of the live stream
              const urlObject = new URL(fullUrl); // Parse the URL
              pathToReturn = urlObject.pathname; // Extract the path portion

              // Parse the query string into a Params object
              queryToReturn = urlObject.search
                .substring(1) // Remove the leading '?'
                .split('&')
                .reduce((acc, param) => {
                  const [key, value] = param.split('=');
                  if (key) acc[key] = decodeURIComponent(value || ''); // Decode and assign the value
                  return acc;
                }, {} as Params);
            } else {
              // Multiple users are live - go to the browse page
              pathToReturn = `/videos/browse`;
              queryToReturn = { live: 'true' }; // Construct a Params object
            }

            defaultLinks.push({
              key: 'live-now',
              title: 'Watch Live',
              links: [
                {
                  label: 'Live Now!',
                  path: pathToReturn,
                  query: queryToReturn, // Use the parsed Params object
                  icon: 'live',
                  isPrimaryButton: true,
                },
              ],
            });
          }
        } catch (error) {
          console.error('Error fetching live videos:', error);
        }
      }

      const filteredLinks = defaultLinks.map((section) => ({
        ...section,
        links: section.links.filter((link) => {
          if (Object.keys(DEFAULT_MENU_ITEMS).includes(section.key) === false) {
            // Keep links added by other plugins
            return true;
          }

          if ((DEFAULT_MENU_ITEMS[section.key as keyof typeof DEFAULT_MENU_ITEMS] || []).includes(link.path || '') === false) {
            // Keep links added by other plugins
            return true;
          }

          return enabledMenuItems[section.key].some((l) => l === link.path);
        }),
      }));

      const itemSections = items
        .trim()
        .split('\n\n')
        .reduce((acc, val) => {
          const [header, ...links] = val.split('\n');

          return {
            key: header.toLowerCase().replace(' ', '-'),
            title: header,
            links: links.filter((l) => l).map((link) => {
              const [, destination] = link.match(/\[destination:([^\]]+)\]/) || []; // Extract destination
              const [, label] = link.match(/\[label:([^\]]+)\]/) || []; // Extract label with "label:" prefix
              const [, icon] = link.match(/\[icon:([^\]]+)\]/) || []; // Extract icon
              const [, iconClass] = link.match(/\[iconClass:([^\]]+)\]/) || []; // Extract iconClass
              const [, isPrimaryButton] = link.match(/\[isPrimaryButton:(true|false)\]/) || []; // Extract isPrimaryButton

              if (!destination) {
                throw new Error(`Invalid link configuration: A destination must be provided. Link: ${link}`);
              }

              let path: string | undefined = undefined;
              let url: string | undefined = undefined;
              let query: Params | undefined = undefined;

              // Determine if the destination is a full URL or a relative path
              if (destination.startsWith('http://') || destination.startsWith('https://')) {
                url = destination; // Treat as a full URL
              } else {
                const [pathPart, queryString] = destination.split('?'); // Split path and query
                path = pathPart; // Treat as a relative path

                // Parse the query string into a Params object if it exists
                if (queryString) {
                  query = queryString.split('&').reduce((acc, param) => {
                    const [key, value] = param.split('=');
                    if (!key) return acc;
                    if (acc[key]) {
                      // If the key already exists, convert it to an array or append to the existing array
                      acc[key] = Array.isArray(acc[key])
                        ? [...acc[key], value || '']
                        : [acc[key] as string, value || ''];
                    } else {
                      acc[key] = value || ''; // Assign the value or an empty string if no value is provided
                    }
                    return acc;
                  }, {} as Params);
                }
              }

              return {
                icon: icon || '', // Default to '' if not provided
                iconClass: iconClass || undefined, // Explicitly set to undefined if not provided
                label: label || 'My Link', // Use the parsed label
                path: path || undefined, // Use path if provided
                url: url || undefined, // Use URL if provided
                query: query || undefined, // Use parsed query if provided
                isPrimaryButton: isPrimaryButton === 'true', // Convert string to boolean, default to false
              };
            }),
          };
        }, null as MenuItem | null);

      return [...filteredLinks, itemSections];
    },
  });
}

export { register };
