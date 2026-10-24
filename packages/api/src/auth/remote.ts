import { logger } from '@dpm-core/shared';

import { BASE_URL, http } from '../http';
import type { ApiResponse } from '../type';
import { setAuthCookies } from './cookie';
import { type ReissueResult, reissueTokens } from './reissue-core';

interface KakaoNativeLoginResponse {
	loginStatus: string;
	accessToken: string;
	refreshToken: string;
	memberId: number;
	memberStatus: string;
	signupContext: unknown | null;
}

// logout은 세션 만료 직후 짧은 시간에 여러 화면(탭 전환, 레이아웃 재마운트 등)에서 동시에
// 호출될 수 있어, 진행 중인 요청을 공유한다. reissue의 동시 요청 공유는 reissue-core에서 처리한다.
let logoutPromise: ReturnType<typeof http.post> | null = null;

export const auth = {
	// ky의 401 자동 재시도 플러그인(create-refresh-plugin)과 동일한 reissueTokens를 공유해서,
	// 이 경로로 직접 reissue를 부르는 요청과 플러그인이 쏘는 reissue가 서로 다른 refreshToken
	// 회전 경쟁을 벌이지 않도록 한다.
	reissue: async (): Promise<ReissueResult> => reissueTokens(`${BASE_URL}/v1/reissue`),
	login: async (params: { email: string; password: string }) => {
		const res = await http.post('login/email', { json: params });
		return res;
	},
	// 카카오 SDK accessToken을 Authorization 헤더로 전달.
	// http 인스턴스의 beforeRequest hook이 우리 토큰으로 덮어쓰는 걸 피하려고 fetch 직접 사용.
	kakaoLogin: async (params: { accessToken: string }) => {
		logger.auth('kakao native login request', { kakaoAccessToken: params.accessToken });

		const res = await fetch(`${BASE_URL}/v1/auth/kakao/native`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${params.accessToken}`,
			},
			credentials: 'include',
		});

		logger.auth('kakao native login response', { status: res.status });

		if (!res.ok) {
			throw new Error(`Kakao native login failed: ${res.status}`);
		}

		const json: ApiResponse<KakaoNativeLoginResponse> = await res.json();
		logger.auth('kakao native login tokens', {
			accessToken: json.data.accessToken,
			refreshToken: json.data.refreshToken,
			memberId: json.data.memberId,
			memberStatus: json.data.memberStatus,
			loginStatus: json.data.loginStatus,
		});

		setAuthCookies({
			accessToken: json.data.accessToken,
			refreshToken: json.data.refreshToken,
		});
		return json;
	},
	logout: async () => {
		if (logoutPromise) return logoutPromise;

		logoutPromise = http.post('logout');

		try {
			return await logoutPromise;
		} finally {
			logoutPromise = null;
		}
	},
};
