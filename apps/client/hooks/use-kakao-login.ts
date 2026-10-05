'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth, BASE_URL } from '@dpm-core/api';
import { toast } from '@dpm-core/shared';

import { useAppConfig } from '@/providers/app-config-provider';
import { useBridgeStatus, useBridgeStore } from '@/providers/bridge-provider';

/**
 * 카카오 로그인 공용 훅
 * 앱(WebView 브릿지)에서는 네이티브 SDK로, 그 외에는 웹 OAuth 경로로 로그인한다.
 */
export const useKakaoLogin = () => {
	const router = useRouter();
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
	const loginWithNative = async () => {
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
			router.replace('/');
		} catch {
			toast.error('카카오 로그인에 실패했습니다.');
		} finally {
			setIsPending(false);
		}
	};

	return { canUseNativeKakao, loginWithNative, webFallbackUrl, isPending };
};
