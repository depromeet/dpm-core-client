import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	transpilePackages: ['@dpm-core/shared', 'motion'],
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
