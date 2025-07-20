import type { Part } from '@dpm-core/api';

export { cn } from '@dpm-core/shared';

export const isExistPart = (targetValue: unknown): targetValue is Exclude<Part, 'ETC'> => {
	const parts: Part[] = ['WEB', 'ANDROID', 'IOS', 'DESIGN', 'SERVER'];
	return parts.includes(targetValue as Part);
};

export const deleteToken = () => {
	// TODO: COOKIE 로 변경
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
};
