'use client';

import { usePathname } from 'next/navigation';
import { type PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { createContext } from '@dpm-core/shared';

import type { ClarityActionId } from '@/constants/clarity';
import {
	type ClarityActor,
	type ClarityEnvironment,
	syncClarityContext,
	trackClarityEvent,
} from '@/lib/clarity/client';
import { getClarityPageId } from '@/lib/clarity/page';
import { useAppConfig } from '@/providers/app-config-provider';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';

interface ClarityContextType {
	track: (action: ClarityActionId) => void;
}

const [ClarityProviderContext, useClarityContext] = createContext<ClarityContextType>('Clarity', {
	track: () => undefined,
});

/**
 * 현재 사용자, 앱 환경, pathname을 자동으로 결합해 Clarity 커스텀 이벤트를 기록한다.
 *
 * @example
 * const { track } = useClarity();
 * track(CLARITY_ACTION_ID.HOME.VOC_BUTTON_CLICK);
 */
const useClarity = () => useClarityContext();

const ClarityProvider = ({ children }: PropsWithChildren) => {
	const pathname = usePathname();

	const { isApp, platform } = useAppConfig();
	const { data, error, isPending, isSuccess } = useQuery(getMyMemberInfoQuery);

	const pageId = getClarityPageId(pathname);
	const environment: ClarityEnvironment = isApp ? (platform ?? 'app_unknown') : 'web';

	const actor = useMemo<ClarityActor>(() => {
		if (isPending) {
			return { status: 'checking' };
		}

		if (isSuccess) {
			return { status: 'member', user: data.data };
		}

		if (error instanceof HTTPError && error.response.status === 401) {
			return { status: 'guest' };
		}

		// 네트워크나 서버 오류를 비회원으로 잘못 분류하지 않음
		return { status: 'checking' };
	}, [data, error, isPending, isSuccess]);

	useEffect(() => {
		syncClarityContext({ actor, pageId, environment });
	}, [actor, environment, pageId]);

	const track = useCallback(
		(action: ClarityActionId) => {
			trackClarityEvent({ actor, pageId, action, environment });
		},
		[actor, environment, pageId],
	);

	return <ClarityProviderContext track={track}>{children}</ClarityProviderContext>;
};

export { ClarityProvider, useClarity };
