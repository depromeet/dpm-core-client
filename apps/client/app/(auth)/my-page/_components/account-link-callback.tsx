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

/**
 * 서버가 내려주는 오류 코드별 안내 문구.
 * 서버 메시지("...다시 로그인해주세요")만으로는 사용자가 할 수 있는 조치를 알기 어려운 경우에 쓴다.
 */
const LINK_ERROR_MESSAGE_BY_CODE: Record<string, (provider: LinkableLoginMethod) => string> = {
	// 연동하려는 소셜 계정이 이미 다른 회원(예: 연동 해제 후 소셜 로그인으로 새로 생긴 계정)에 연결된 경우
	'MEMBER-409-21': (provider) =>
		`이미 다른 계정에 연결된 ${PROVIDER_LABEL[provider]} 계정이에요. 운영진에게 문의해 주세요.`,
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
				const body =
					error instanceof HTTPError
						? ((await error.response.json().catch(() => null)) as ApiErrorReponse | null)
						: null;
				const guidance = body?.code ? LINK_ERROR_MESSAGE_BY_CODE[body.code]?.(provider) : undefined;
				setErrorMessage(guidance ?? body?.message ?? `${PROVIDER_LABEL[provider]} 연동에 실패했어요.`);
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
