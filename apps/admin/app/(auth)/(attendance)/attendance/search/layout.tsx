import type { ReactNode } from 'react';
import { AppLayout } from '@dpm-core/shared';

interface LayoutProps {
	tabs: ReactNode;
}

export default function Layout({ tabs }: LayoutProps) {
	return <AppLayout className="min-h-dvh min-w-0 bg-background-normal">{tabs}</AppLayout>;
}
