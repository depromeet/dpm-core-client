import type { ReactNode } from 'react';
import { AppHeader } from '@/components/app-header';

interface LayoutProps {
	tabs: ReactNode;
}

export default function Layout({ tabs }: LayoutProps) {
	return (
		<div className="flex flex-col min-h-dvh">
			<AppHeader title="출석" backHref="/" className="mb-2" />
			{tabs}
		</div>
	);
}
