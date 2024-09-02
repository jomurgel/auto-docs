const withNextra = require('nextra')({
	theme: 'nextra-theme-docs',
	themeConfig: './theme.config.tsx',
});

const nextConfig = {
	assetPrefix: '/',
	basePath: '',
	images: {
		unoptimized: true,
	},
	reactStrictMode: true,
	swcMinify: true,
	trailingSlash: true,
};

module.exports = {
	...withNextra(),
	...nextConfig,
};
