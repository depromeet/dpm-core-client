import type { Part } from '@dpm-core/api';

export const PART_LABEL_MAP: Record<Part, string> = {
	WEB: '웹',
	ANDROID: '안드로이드',
	IOS: 'iOS',
	DESIGN: '디자이너',
	SERVER: '서버',
	ETC: '미배정',
};

export const getMemberPartLabel = (part?: Part) => {
	return part ? PART_LABEL_MAP[part] : '-';
};
