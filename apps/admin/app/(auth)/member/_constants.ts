import type { StaticImageData } from 'next/image';
import type {
	ManagedMemberPart,
	ManagedMemberType,
	MemberActivityStatus,
	MemberApprovalStatus,
} from '@dpm-core/api';

import ANDROID from '@/assets/icons/aos.webp';
import DESIGN from '@/assets/icons/design.webp';
import UNASSIGNED from '@/assets/icons/etc.webp';
import IOS from '@/assets/icons/ios.webp';
import SERVER from '@/assets/icons/server.webp';
import WEB from '@/assets/icons/web.webp';

/** 목록 한 번에 받아오는 개수. 무한 스크롤 단위 */
export const MEMBER_PAGE_SIZE = 30;

/** 미배정을 나타내는 팀 번호 */
export const UNASSIGNED_TEAM_NUMBER = 0;

export const APPROVAL_TABS = [
	{ value: 'PENDING', label: '미승인' },
	{ value: 'APPROVED', label: '승인 완료' },
] as const satisfies ReadonlyArray<{ value: MemberApprovalStatus; label: string }>;

export const PART_LABEL: Record<ManagedMemberPart, string> = {
	UNASSIGNED: '미배정',
	DESIGN: '디자이너',
	WEB: '웹',
	ANDROID: '안드로이드',
	IOS: 'IOS',
	SERVER: '서버',
};

/** 파트 선택지 노출 순서 (Figma 필터·수정 모달 기준) */
export const PART_ORDER: ManagedMemberPart[] = [
	'UNASSIGNED',
	'DESIGN',
	'WEB',
	'ANDROID',
	'IOS',
	'SERVER',
];

export const PART_ICON: Record<ManagedMemberPart, StaticImageData> = {
	UNASSIGNED,
	DESIGN,
	WEB,
	ANDROID,
	IOS,
	SERVER,
};

export const MEMBER_TYPE_LABEL: Record<ManagedMemberType, string> = {
	UNASSIGNED: '미배정',
	DEEPER: '디퍼',
	ORGANIZER: '운영진',
	CORE: '코어',
};

export const MEMBER_TYPE_ORDER: ManagedMemberType[] = ['UNASSIGNED', 'DEEPER', 'ORGANIZER', 'CORE'];

export const ACTIVITY_STATUS_LABEL: Record<MemberActivityStatus, string> = {
	NORMAL: '활동 중',
	AT_RISK: '활동 중 (수료위험)',
	INACTIVE: '활동 정지',
};

export const ACTIVITY_STATUS_ORDER: MemberActivityStatus[] = ['NORMAL', 'AT_RISK', 'INACTIVE'];

export const PART_OPTIONS = PART_ORDER.map((value) => ({ value, label: PART_LABEL[value] }));

export const MEMBER_TYPE_OPTIONS = MEMBER_TYPE_ORDER.map((value) => ({
	value,
	label: MEMBER_TYPE_LABEL[value],
}));

export const ACTIVITY_STATUS_OPTIONS = ACTIVITY_STATUS_ORDER.map((value) => ({
	value,
	label: ACTIVITY_STATUS_LABEL[value],
}));
