import type { HTTPError } from 'ky';
import { clearAuthCookies } from '@dpm-core/api';

let isRedirecting = false;

const getHttpStatus = (error: unknown) => {
	return (error as HTTPError | undefined)?.response?.status ?? null;
};

export const handleQueryError = (error: unknown) => {
	if (typeof window === 'undefined' || isRedirecting) {
		return;
	}

	if (getHttpStatus(error) !== 401 || window.location.pathname.startsWith('/login')) {
		return;
	}

	isRedirecting = true;
	clearAuthCookies();
	window.location.assign('/login');
};
