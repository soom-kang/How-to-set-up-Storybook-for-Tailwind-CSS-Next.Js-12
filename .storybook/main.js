module.exports = {
	stories: [
		'../components/**/*.stories.@(js|jsx|ts|tsx)',
		'../pages/**/*.stories.@(js|jsx|ts|tsx)',
	],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-actions',
		'@storybook/addon-essentials',
		{
			name: '@storybook/preset-scss',
			options: {
				cssLoaderOptions: {
					modules: { localIdentName: '[name]__[local]--[hash:base64:5]' },
				},
			},
		},
		'storybook-addon-next',
	],
	framework: '@storybook/react',
	core: {
		builder: 'webpack5',
	},
};
