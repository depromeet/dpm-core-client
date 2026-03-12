import { headers } from 'next/headers';
import { type DPMAppInfo, parseAppPlatform, parseSafeAreaInsets } from '@dpm-core/shared';

export async function getAppConfig(): Promise<DPMAppInfo> {
	const headersList = await headers();

	const isApp = headersList.get('x-app-is-app') === 'true';
	const appVersion = headersList.get('x-app-version') ?? null;
	const platform = parseAppPlatform(headersList.get('x-app-platform'));
	const safeAreaInsets = parseSafeAreaInsets(headersList.get('x-app-safe-area-insets'));

	return { isApp, appVersion, platform, safeAreaInsets };
}
