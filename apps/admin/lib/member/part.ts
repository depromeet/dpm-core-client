import type { Part } from '@dpm-core/api';

export const PART_LABEL_MAP: Record<Exclude<Part, 'ETC'>, string> = {
	WEB: '웹',
	ANDROID: '모바일/AOS',
	IOS: '모바일/IOS',
	DESIGN: '디자이너',
	SERVER: '서버',
};

export const getMemberPartLabel = (part: Exclude<Part, 'ETC'>) => {
	return PART_LABEL_MAP[part] ?? '-';
};
