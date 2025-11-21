'use client';

import { useParams } from 'next/navigation';
import { useIsMobile } from '@dpm-core/shared';

export const SessionMobileGuard = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const params = useParams<{ id?: string }>();
	const isMobile = useIsMobile();

	if (params.id && isMobile) return null;

	return <>{children}</>;
};
