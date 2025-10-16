import type { ReactNode } from 'react';

import { AppHeader } from '@/components/app-header';

interface LayoutProps {
	tabs: ReactNode;
}

export default function Layout({ tabs }: LayoutProps) {
	return (
		<div className="flex min-h-dvh flex-col">
			<AppHeader title="출석" className="mb-2" />
			{tabs}
		</div>
	);
}
