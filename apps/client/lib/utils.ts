import Cookies from 'js-cookie';
import { COOKIE_KEYS, getSharedAuthCookieOptions, type Part } from '@dpm-core/api';

export { cn } from '@dpm-core/shared';

export const isExistPart = (targetValue: unknown): targetValue is Exclude<Part, 'ETC'> => {
	const parts: Part[] = ['WEB', 'ANDROID', 'IOS', 'DESIGN', 'SERVER'];
	return parts.includes(targetValue as Part);
};

export const deleteToken = () => {
	Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN);
	Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN);

	if (typeof window === 'undefined') {
		return;
	}

	const sharedCookieOptions = getSharedAuthCookieOptions(window.location.hostname);
	Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN, sharedCookieOptions);
	Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN, sharedCookieOptions);
};
