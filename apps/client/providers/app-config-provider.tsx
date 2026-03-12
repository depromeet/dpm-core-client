'use client';

import type { PropsWithChildren } from 'react';
import { createContext, type DPMAppInfo } from '@dpm-core/shared';

const [AppConfigProviderContext, useAppConfig] = createContext<DPMAppInfo>('AppConfig', {
	isApp: false,
	appVersion: null,
	platform: null,
	safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
});

const AppConfigProvider = ({
	children,
	isApp,
	appVersion,
	platform,
	safeAreaInsets,
}: PropsWithChildren<DPMAppInfo>) => {
	return (
		<AppConfigProviderContext
			isApp={isApp}
			appVersion={appVersion}
			platform={platform}
			safeAreaInsets={safeAreaInsets}
		>
			{children}
		</AppConfigProviderContext>
	);
};

export { AppConfigProvider, useAppConfig };
