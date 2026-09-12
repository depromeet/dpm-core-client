'use client';

import { usePathname } from 'next/navigation';
import { type PropsWithChildren, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { IS_PROD } from '@dpm-core/api';
import { type ClarityActor, createClarity, createClarityMemberActor } from '@dpm-core/shared';

import type { ClarityActionId, ClarityPageId } from '@/constants/clarity';
import { getClarityPageId } from '@/lib/clarity/page';
import { useAppConfig } from '@/providers/app-config-provider';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';

interface ClientClarityAdapterProps extends PropsWithChildren {
	projectId: string;
}

type ClarityEnvironment = 'web' | 'ios' | 'android' | 'app_unknown';

const { ClarityProvider, useClarity } = createClarity<ClarityActionId, ClarityPageId>();

/** 현재 client 상태를 공통 Clarity Provider에 연결한다. */
const ClientClarityAdapter = ({ projectId, children }: ClientClarityAdapterProps) => {
	const pathname = usePathname();
	const { isApp, platform } = useAppConfig();
	const { data, error, isPending, isSuccess } = useQuery(getMyMemberInfoQuery);

	const pageId = getClarityPageId(pathname);
	const environment: ClarityEnvironment = isApp ? (platform ?? 'app_unknown') : 'web';

	const actor = useMemo<ClarityActor>(() => {
		if (isPending) return { status: 'checking' };

		if (isSuccess) {
			return createClarityMemberActor({
				customId: data.data.email,
				cohort: data.data.cohort,
				isAdmin: data.data.isAdmin,
				status: data.data.status,
			});
		}

		if (error instanceof HTTPError && error.response.status === 401) {
			return { status: 'guest' };
		}

		// 네트워크나 서버 오류를 비회원으로 잘못 분류하지 않음
		return { status: 'checking' };
	}, [data, error, isPending, isSuccess]);

	const tags = useMemo(() => ({ user_environment: environment }), [environment]);

	return (
		<ClarityProvider
			projectId={projectId}
			enabled={IS_PROD}
			actor={actor}
			pageId={pageId}
			tags={tags}
		>
			{children}
		</ClarityProvider>
	);
};

export { ClientClarityAdapter, useClarity };
