import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import NextScript from 'next/script';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
	AppShell,
	GAInitializer,
	getGAConfigScript,
	getGAScriptSrc,
	parseAppPlatform,
	parseSafeAreaInsets,
	Toaster,
} from '@dpm-core/shared';

import { QueryProvider } from '../providers/query-provider';
import { pretendard } from './fonts';

import './globals.css';

import { AppConfigProvider } from '@/providers/app-config-provider';
import { BridgeProvider } from '@/providers/bridge-provider';

export const metadata: Metadata = {
	title: 'Dpmcore',
	description: 'Dpmcore',
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	minimumScale: 1,
	viewportFit: 'cover',
};
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersList = await headers();
	const isApp = headersList.get('x-app-is-app') === 'true';
	const appVersion = headersList.get('x-app-version') ?? null;
	const platform = parseAppPlatform(headersList.get('x-app-platform'));
	const safeAreaInsets = parseSafeAreaInsets(headersList.get('x-app-safe-area-insets'));

	return (
		<html
			lang="ko"
			style={
				{
					'--safe-area-inset-top': `${safeAreaInsets.top}px`,
					'--safe-area-inset-right': `${safeAreaInsets.right}px`,
					'--safe-area-inset-bottom': `${safeAreaInsets.bottom}px`,
					'--safe-area-inset-left': `${safeAreaInsets.left}px`,
				} as React.CSSProperties
			}
		>
			<head>
				<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="manifest" href="/site.webmanifest" />
			</head>
			<body className={pretendard.variable} suppressHydrationWarning>
				{/* @ts-ignore */}
				<NextScript src={getGAScriptSrc()} />
				<NextScript id="google-analytics">{getGAConfigScript()}</NextScript>
				<QueryProvider>
					<GAInitializer />
					<AppConfigProvider
						isApp={isApp}
						appVersion={appVersion}
						platform={platform}
						safeAreaInsets={safeAreaInsets}
					>
						<BridgeProvider>
							<AppShell>{children}</AppShell>
						</BridgeProvider>
					</AppConfigProvider>
					<ReactQueryDevtools />
					<Toaster
						position="top-center"
						visibleToasts={1}
						style={{
							display: 'flex',
							justifyContent: 'center',
						}}
						toastOptions={{
							duration: 3_000,
						}}
					/>
				</QueryProvider>
			</body>
		</html>
	);
}
