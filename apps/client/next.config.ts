import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	transpilePackages: ['@dpm-core/shared', 'motion'],
};

export default nextConfig;
