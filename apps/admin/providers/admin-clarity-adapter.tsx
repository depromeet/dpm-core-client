'use client';

import { usePathname } from 'next/navigation';
import { type PropsWithChildren, useMemo } from 'react';
import { type ClarityActor, createClarity, createClarityMemberActor } from '@dpm-core/shared';

import type { ClarityActionId, ClarityPageId } from '@/constants/clarity';
import { getClarityPageId } from '@/lib/clarity/page';
import { useAuth } from '@/providers/auth-provider';

interface AdminClarityAdapterProps extends PropsWithChildren {
	projectId: string;
}

const { ClarityProvider, useClarity } = createClarity<ClarityActionId, ClarityPageId>();
const CLARITY_TAGS = { user_environment: 'web' } as const;

/** 현재 admin 상태를 공통 Clarity Provider에 연결한다. */
const AdminClarityAdapter = ({ projectId, children }: AdminClarityAdapterProps) => {
	const pathname = usePathname();
	const { isAuthenticated, user } = useAuth();
	const pageId = getClarityPageId(pathname);

	const actor = useMemo<ClarityActor>(() => {
		if (!isAuthenticated || !user) return { status: 'checking' };

		return createClarityMemberActor({
			customId: user.email,
			cohort: user.cohort,
			isAdmin: user.isAdmin,
			status: user.status,
		});
	}, [isAuthenticated, user]);

	return (
		<ClarityProvider
			projectId={projectId}
			enabled={process.env.NEXT_PUBLIC_STAGE === 'production' && isAuthenticated}
			actor={actor}
			pageId={pageId}
			tags={CLARITY_TAGS}
		>
			{children}
		</ClarityProvider>
	);
};

export { AdminClarityAdapter, useClarity };
