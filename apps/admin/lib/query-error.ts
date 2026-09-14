import type { HTTPError } from 'ky';
import { COOKIE_KEYS } from '@dpm-core/api';

let isRedirecting = false;

const getHttpStatus = (error: unknown) => {
	return (error as HTTPError | undefined)?.response?.status ?? null;
};

const deleteCookie = (key: string) => {
	document.cookie = `${key}=; Max-Age=0; path=/`;
};

const deleteToken = () => {
	deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
	deleteCookie(COOKIE_KEYS.REFRESH_TOKEN);
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
