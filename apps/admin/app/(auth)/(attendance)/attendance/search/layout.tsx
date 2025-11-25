import type { ReactNode } from 'react';
import { AppLayout } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

interface LayoutProps {
	tabs: ReactNode;
}

export default function Layout({ tabs }: LayoutProps) {
	return (
		<>
			<AppLayout className="hidden min-h-dvh min-w-0 bg-background-normal md:flex">
				{tabs}
			</AppLayout>

			<AppLayout className="min-h-dvh min-w-0 bg-background-normal md:hidden">
				<AppHeader title="출석" className="mb-2" />
				{tabs}
			</AppLayout>
		</>
	);
}
