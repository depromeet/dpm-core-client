import type { HTTPError } from 'ky';
import { COOKIE_KEYS, getSharedAuthCookieOptions } from '@dpm-core/api';

let isRedirecting = false;

const getHttpStatus = (error: unknown) => {
	return (error as HTTPError | undefined)?.response?.status ?? null;
};

const deleteCookie = (key: string, options: { domain?: string; path?: string } = {}) => {
	const path = options.path ?? '/';
	const domain = options.domain ? `; domain=${options.domain}` : '';
	document.cookie = `${key}=; Max-Age=0; path=${path}${domain}`;
};

const deleteToken = () => {
	deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
	deleteCookie(COOKIE_KEYS.REFRESH_TOKEN);

	const sharedCookieOptions = getSharedAuthCookieOptions(window.location.hostname);
	deleteCookie(COOKIE_KEYS.ACCESS_TOKEN, sharedCookieOptions);
	deleteCookie(COOKIE_KEYS.REFRESH_TOKEN, sharedCookieOptions);
};

export const handleQueryError = (error: unknown) => {
	if (typeof window === 'undefined' || isRedirecting) {
		return;
	}

	if (getHttpStatus(error) !== 401 || window.location.pathname.startsWith('/login')) {
		return;
	}

	isRedirecting = true;
	deleteToken();
	window.location.assign('/login');
};
