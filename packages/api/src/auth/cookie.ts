import Cookies from 'js-cookie';

import { COOKIE_KEYS } from '../constants';

const SHARED_COOKIE_ROOT_DOMAIN = 'depromeet.com';

/**
 * Returns the shared auth cookie domain only for depromeet-owned hosts.
 */
export const getSharedCookieDomain = (hostname: string) => {
	const normalizedHostname = hostname.toLowerCase();

	if (
		normalizedHostname === SHARED_COOKIE_ROOT_DOMAIN ||
		normalizedHostname.endsWith(`.${SHARED_COOKIE_ROOT_DOMAIN}`)
	) {
		return `.${SHARED_COOKIE_ROOT_DOMAIN}`;
	}

	return undefined;
};

/**
 * Builds cookie options used by auth cookies that must be shared across depromeet subdomains.
 */
export const getSharedAuthCookieOptions = (hostname: string) =>
	({
		domain: getSharedCookieDomain(hostname),
		path: '/',
	}) as const;

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
