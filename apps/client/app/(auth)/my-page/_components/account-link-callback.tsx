'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import type { ApiErrorReponse, LinkableLoginMethod } from '@dpm-core/api';
import { Button } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { LoadingBox } from '@/components/loading-box';
import { completeAccountLinkMutationOptions } from '@/remotes/mutations/member';
import { getMyAccountsQuery } from '@/remotes/queries/member';

const PROVIDER_LABEL: Record<LinkableLoginMethod, string> = {
	KAKAO: '카카오',
	APPLE: '애플',
};

interface AccountLinkCallbackProps {
	provider: LinkableLoginMethod;
	code?: string;
	state?: string;
	/** 제공자 콜백이 자체적으로 돌려준 에러 (예: 사용자가 인증을 취소한 경우) */
	providerError?: string;
}

/**
 * 카카오·애플 OAuth 콜백 공통 완료 화면.
 * code/state 를 받아 연결 완료 API를 호출한 뒤 결과를 보여준다.
 */
export const AccountLinkCallback = ({
	provider,
	code,
	state,
	providerError,
}: AccountLinkCallbackProps) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const hasRequested = useRef(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(
		providerError ? `${PROVIDER_LABEL[provider]} 인증에 실패했어요.` : null,
	);

	const { mutate, isPending, isSuccess } = useMutation(
		completeAccountLinkMutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: getMyAccountsQuery.queryKey });
			},
			onError: async (error) => {
				const message =
					error instanceof HTTPError
						? ((await error.response.json().catch(() => null)) as ApiErrorReponse | null)?.message
						: null;
				setErrorMessage(message ?? `${PROVIDER_LABEL[provider]} 연동에 실패했어요.`);
			},
		}),
	);

	useEffect(() => {
		if (hasRequested.current || providerError || !code || !state) return;
		hasRequested.current = true;
		mutate({ provider, authorizationCode: code, state });
	}, [provider, code, state, providerError, mutate]);

	const missingParams = !providerError && (!code || !state);

	return (
		<SafeAreaAppLayout className="h-dvh bg-background-normal">
			<AppHeader title={`${PROVIDER_LABEL[provider]} 계정 연동`} hideBackButton />
			<div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
				{isPending ? (
					<LoadingBox />
				) : isSuccess ? (
					<>
						<p className="font-semibold text-body1 text-label-normal">
							{PROVIDER_LABEL[provider]} 계정을 연동했어요.
						</p>
						<Button variant="secondary" size="lg" onClick={() => router.replace('/my-page')}>
							마이페이지로 이동
						</Button>
					</>
				) : (
					<>
						<p className="font-semibold text-body1 text-label-normal">
							{errorMessage ?? (missingParams ? '잘못된 접근이에요.' : '계정을 연동하지 못했어요.')}
						</p>
						<Button variant="secondary" size="lg" onClick={() => router.replace('/my-page')}>
							마이페이지로 이동
						</Button>
					</>
				)}
			</div>
		</SafeAreaAppLayout>
	);
};
