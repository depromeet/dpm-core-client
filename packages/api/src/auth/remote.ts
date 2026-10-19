import { logger } from '@dpm-core/shared';

import { BASE_URL, http } from '../http';
import type { ApiResponse } from '../type';
import { getAuthEpoch, setAuthCookies } from './cookie';

interface ReissueResponse {
	token: string;
	expirationTime: number;
	refreshToken: string;
	refreshTokenExpirationTime: number;
}

interface KakaoNativeLoginResponse {
	loginStatus: string;
	accessToken: string;
	refreshToken: string;
	memberId: number;
	memberStatus: string;
	signupContext: unknown | null;
}

// reissue/logout은 세션 만료 직후 짧은 시간에 여러 화면(탭 전환, 레이아웃 재마운트 등)에서 동시에
// 호출될 수 있다. 동시 요청이 겹치면 토큰 재발급 경쟁(한쪽은 성공, 한쪽은 이미 회전된 refreshToken으로
// 401)이나 세션 정리 충돌로 이어져 로그인이 복구되지 않는 상태에 빠질 수 있어, 진행 중인 요청을 공유한다.
let reissuePromise: Promise<ApiResponse<ReissueResponse>> | null = null;
let logoutPromise: ReturnType<typeof http.post> | null = null;

export const auth = {
	reissue: async () => {
		if (reissuePromise) return reissuePromise;

		const epochAtStart = getAuthEpoch();
		reissuePromise = (async () => {
			const res = await http.get<ReissueResponse>('v1/reissue');

			// 응답을 기다리는 사이 로그아웃/탈퇴가 일어났다면, 이미 지운 쿠키를 되살리지 않는다.
			if (getAuthEpoch() !== epochAtStart) {
				throw new Error('Auth session was cleared while reissuing.');
			}

			setAuthCookies({
				accessToken: res.data.token,
				refreshToken: res.data.refreshToken,
			});
			return res;
		})();

		try {
			return await reissuePromise;
		} finally {
			reissuePromise = null;
		}
	},
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
