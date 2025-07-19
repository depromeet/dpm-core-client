import { cn } from '@dpm-core/shared';
import type { Metadata, Viewport } from 'next';
import { QueryProvider } from '../providers/query-provider';
import { pretendard } from './fonts';
import './globals.css';
import { ViewTransitions } from 'next-view-transitions';

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
					<ViewTransitions>
						<main className="max-w-lg mx-auto min-h-dvh">{children}</main>
					</ViewTransitions>
				</QueryProvider>
			</body>
		</html>
	);
}
