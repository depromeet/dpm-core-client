import { AppLayout } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';
import { Section } from '@/components/section';

export default async function SessionLayout({
	children,
	detail,
}: Readonly<{
	detail: React.ReactNode;
	children: React.ReactNode;
}>) {
	return (
		<div className="flex w-full flex-col overflow-x-hidden">
			<AppHeader title="세션" className="max-md:hidden" />
			<main className="flex flex-1">
				<AppLayout className="bg-background-normal">
					<Section className="flex h-full flex-col px-0 md:flex-row">
						{children}
						{detail}
					</Section>
				</AppLayout>
			</main>
		</div>
	);
}
