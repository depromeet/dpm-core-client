import type { HTTPError } from 'ky';

import { deleteToken } from './utils';

let isRedirecting = false;

const getHttpStatus = (error: unknown) => {
	return (error as HTTPError | undefined)?.response?.status ?? null;
};

export const handleGlobalQueryError = (error: unknown) => {
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
