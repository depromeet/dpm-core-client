import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
	AppShell,
	GAInitializer,
	getGAConfigScript,
	getGAScriptSrc,
	Toaster,
} from '@dpm-core/shared';

import { QueryProvider } from '../providers/query-provider';
import { pretendard } from './fonts';

import './globals.css';

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
};

console.log('test');

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<head>
				<Script src={getGAScriptSrc()} />
				<Script id="google-analytics">{getGAConfigScript()}</Script>
				<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="manifest" href="/site.webmanifest" />
			</head>
			<body className={pretendard.variable} suppressHydrationWarning>
				<QueryProvider>
					<GAInitializer />
					<AppShell>{children}</AppShell>
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
