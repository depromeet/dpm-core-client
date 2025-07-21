import { COOKIE_KEYS, type Part } from '@dpm-core/api';
import Cookies from 'js-cookie';

export { cn } from '@dpm-core/shared';

export const isExistPart = (targetValue: unknown): targetValue is Exclude<Part, 'ETC'> => {
	const parts: Part[] = ['WEB', 'ANDROID', 'IOS', 'DESIGN', 'SERVER'];
	return parts.includes(targetValue as Part);
};

export const deleteToken = () => {
	Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN);
	Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN);
};
