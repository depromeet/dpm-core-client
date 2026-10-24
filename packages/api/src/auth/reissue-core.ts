import Cookies from 'js-cookie';
import { logger } from '@dpm-core/shared';

import { COOKIE_KEYS } from '../constants';
import { getAuthEpoch, setAuthCookies } from './cookie';

export interface ReissueResult {
	token: string;
	expirationTime: number;
	refreshToken: string;
	refreshTokenExpirationTime: number;
}

// reissue/logout은 세션 만료 직후 짧은 시간에 여러 화면(탭 전환, 레이아웃 재마운트 등)과
// ky의 401 자동 재시도 플러그인에서 동시에 호출될 수 있다. 동시 요청이 겹치면 토큰 재발급 경쟁
// (한쪽은 성공, 한쪽은 이미 회전된 refreshToken으로 401)으로 이어져 로그인이 복구되지 않는
// 상태에 빠질 수 있어, 호출자가 누구든 진행 중인 요청을 공유한다.
let reissuePromise: Promise<ReissueResult> | null = null;

export const reissueTokens = async (refreshUrl: string): Promise<ReissueResult> => {
	if (reissuePromise) return reissuePromise;

	const epochAtStart = getAuthEpoch();
	reissuePromise = (async () => {
		// 앱(WebView)에서는 서버가 내려준 refreshToken 쿠키가 WebView 쿠키 저장소에 없을 수 있어
		// (쿠키만 보내면 cookieCount=0으로 401) 서버가 쿠키보다 우선하는 Bearer 헤더로도 함께 보낸다.
		const refreshToken = Cookies.get(COOKIE_KEYS.REFRESH_TOKEN);
		const res = await fetch(refreshUrl, {
			method: 'GET',
			credentials: 'include',
			headers: refreshToken ? { Authorization: `Bearer ${refreshToken}` } : undefined,
		});

		if (!res.ok) {
			throw new Error(`Refresh failed with status: ${res.status}`);
		}

		const body = await res.json();
		const data: ReissueResult = body.data;

		// 응답을 기다리는 사이 로그아웃/탈퇴가 일어났다면, 이미 지운 쿠키를 되살리지 않는다.
		if (getAuthEpoch() !== epochAtStart) {
			throw new Error('Auth session was cleared while reissuing.');
		}

		setAuthCookies({ accessToken: data.token, refreshToken: data.refreshToken });
		return data;
	})();

	try {
		return await reissuePromise;
	} catch (error) {
		logger.error('refresh 실패', error);
		throw error;
	} finally {
		reissuePromise = null;
	}
};
