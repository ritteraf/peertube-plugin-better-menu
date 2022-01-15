async function register ({
  registerHook,
  registerSetting,
  settingsManager,
  storageManager,
  videoCategoryManager,
  videoLicenceManager,
  videoLanguageManager
}) {
  registerSetting({
    name: 'enabled',
    label: 'Enabled',
    type: 'input-checkbox',
    default: false,
    private: false,
  });

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
