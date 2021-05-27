function register ({ registerHook, peertubeHelpers }) {
	registerHook({
    target: 'filter:top-menu.params',
		handler: (items) => {
			return [
				...items.filter(item => item.key !== 'on-instance'),
				{
					key: 'categories',
					title: 'Our categories',
					children: [
						{
							key: 'science-and-technology',
							title: 'Science and technology',
							href: 'https://science-and-tech.com',
						},
					],
				},
			];
		},
	});
}

export {
  register
}
