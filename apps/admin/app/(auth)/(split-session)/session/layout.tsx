import { AppLayout } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { SessionSheet } from './@detail/_components/SessionSheet';

export default async function SessionLayout({
	children,
	detail,
}: Readonly<{
	detail: React.ReactNode;
	children: React.ReactNode;
}>) {
	return (
		<AppLayout className="flex flex-col bg-background-normal">
			<AppHeader title="세션" />
			{children}
			<SessionSheet>{detail}</SessionSheet>
		</AppLayout>
	);
}
