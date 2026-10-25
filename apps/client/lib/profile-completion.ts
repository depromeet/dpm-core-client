import type { MemberProfile } from '@dpm-core/api';

/**
 * 이름·직군 입력이 더 필요한 프로필인지 판단한다.
 * 서버 플래그(`profileCompletionRequired`)가 false 여도 이름이 비었거나 직군이 미배정이면
 * 운영진이 승인 여부를 판단할 수 없으므로 입력이 필요한 것으로 본다.
 */
export const isProfileIncomplete = (profile: MemberProfile): boolean => {
	if (profile.profileCompletionRequired) return true;

	const hasName = profile.name.trim().length > 0;
	const hasPart = Boolean(profile.part) && profile.part !== 'UNASSIGNED';

	return !hasName || !hasPart;
};
