import Cookies from 'js-cookie';

import { COOKIE_KEYS } from '../constants';

export const setCookie = (token: string, expirationTime: number) => {
	Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, token, {
		expires: new Date(Date.now() + expirationTime * 1000),
	});
};

/**
 * JWT payload의 exp claim(초 단위)을 읽어 Date로 변환.
 * 디코드 실패 시 undefined → js-cookie가 세션 쿠키로 처리.
 */
const getJwtExpiry = (token: string): Date | undefined => {
	try {
		const payload = token.split('.')[1];
		const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
		if (typeof decoded.exp === 'number') {
			return new Date(decoded.exp * 1000);
		}
	} catch {
		// 디코드 실패는 무시 (세션 쿠키로 폴백)
	}
	return undefined;
};

export const setAuthCookies = ({
	accessToken,
	refreshToken,
}: {
	accessToken: string;
	refreshToken: string;
}) => {
	Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
		expires: getJwtExpiry(accessToken),
	});
	Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
		expires: getJwtExpiry(refreshToken),
	});
};
