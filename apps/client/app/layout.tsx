import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { pretendard } from './fonts';
import './globals.css';

export const metadata: Metadata = {
	title: 'Dpmcore',
	description: 'Dpmcore',
};

export const viewport: Viewport = {
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	minimumScale: 1,
	width: 'device-width',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body className={cn(pretendard.variable)}>
				<main className="max-w-lg mx-auto min-h-dvh">{children}</main>
			</body>
		</html>
	);
}
