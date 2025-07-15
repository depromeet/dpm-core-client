import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	transpilePackages: ['@dpm-core/shared', 'motion'],
};

export default nextConfig;
