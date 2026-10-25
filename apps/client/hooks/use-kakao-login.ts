'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { auth, BASE_URL } from '@dpm-core/api';
import { toast } from '@dpm-core/shared';

import { setLastLoginMethod } from '@/lib/last-login';
import { memberAuthQueryKey } from '@/providers/auth-provider';
import { useAppConfig } from '@/providers/app-config-provider';
import { useBridgeStatus, useBridgeStore } from '@/providers/bridge-provider';

/**
 * 카카오 로그인 공용 훅
 * 앱(WebView 브릿지)에서는 네이티브 SDK로, 그 외에는 웹 OAuth 경로로 로그인한다.
 */
export const useKakaoLogin = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { isApp } = useAppConfig();
	const { isWebViewBridgeAvailable, isNativeMethodAvailable } = useBridgeStatus();
	const kakaoLogin = useBridgeStore(({ kakaoLogin }) => kakaoLogin);
	const [isPending, setIsPending] = useState(false);

	const canUseNativeKakao =
		isApp && isWebViewBridgeAvailable && isNativeMethodAvailable('kakaoLogin');

	const webFallbackUrl = (() => {
		const url = new URL(BASE_URL ?? '');
		url.pathname = '/login/kakao';
		return url.toString();
	})();

	/** 네이티브 카카오 SDK 로그인. `canUseNativeKakao`가 true일 때만 호출한다. */
	const loginWithNative = async (options?: { onSuccess?: () => void }) => {
		if (isPending) return;

		setIsPending(true);
		try {
			const result = await kakaoLogin();

			if (!result.success) {
				if (!result.cancelled) {
					toast.error(result.error);
				}
				return;
			}

			await auth.kakaoLogin({ accessToken: result.accessToken });
			setLastLoginMethod('KAKAO');
			// 앱 첫 실행 때 홈에서 실패한 reissue 에러가 AuthProvider 쿼리 캐시에 남아 있다. 로그인 화면에는 이 쿼리를
			// 보는 곳이 없어 invalidate는 stale 표시만 할 뿐 에러를 지우지 않으므로, 이동 후 첫 렌더에서
			// 캐시된 에러 때문에 다시 로그인 화면으로 보내진다. 캐시를 제거해 새로 시작한다.
			queryClient.removeQueries({ queryKey: memberAuthQueryKey });
			if (options?.onSuccess) options.onSuccess();
			else router.replace('/');
		} catch {
			toast.error('카카오 로그인에 실패했습니다.');
		} finally {
			setIsPending(false);
		}
	};

	return { canUseNativeKakao, loginWithNative, webFallbackUrl, isPending };
};
