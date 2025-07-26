import { cn, Toaster } from '@dpm-core/shared';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Metadata, Viewport } from 'next';
import { QueryProvider } from '../providers/query-provider';
import { pretendard } from './fonts';

import './globals.css';
import { AppShell } from '@/providers/app-shell-provider';

export const metadata: Metadata = {
	title: 'Dpmcore',
	description: 'Dpmcore',
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body className={cn(pretendard.variable)}>
				<QueryProvider>
					<AppShell>{children}</AppShell>
					<ReactQueryDevtools />
					<Toaster
						position="top-center"
						visibleToasts={1}
						style={{ pointerEvents: 'none' }}
						toastOptions={{
							duration: 3_000,
						}}
					/>
				</QueryProvider>
			</body>
		</html>
	);
}
