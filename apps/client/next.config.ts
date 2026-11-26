import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	async rewrites() {
		return [{ source: '/storybook', destination: '/storybook/index.html' }];
	},
};

export default nextConfig;
