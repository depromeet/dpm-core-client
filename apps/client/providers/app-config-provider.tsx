'use client';

import type { PropsWithChildren } from 'react';
import { createContext, type DPMAppInfo } from '@dpm-core/shared';

const [AppConfigProviderContext, useAppConfig] = createContext<DPMAppInfo>('AppConfig', {
	isApp: false,
	appVersion: null,
	platform: null,
});

const AppConfigProvider = ({
	children,
	isApp,
	appVersion,
	platform,
}: PropsWithChildren<DPMAppInfo>) => {
	return (
		<AppConfigProviderContext isApp={isApp} appVersion={appVersion} platform={platform}>
			{children}
		</AppConfigProviderContext>
	);
};

export { AppConfigProvider, useAppConfig };
