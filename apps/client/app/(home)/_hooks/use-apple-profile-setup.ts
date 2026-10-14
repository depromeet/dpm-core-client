'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyMemberInfoQuery, getMyProfileQuery } from '@/remotes/queries/member';

/**
 * 이름·직군 최초 입력 필요 여부 판단 훅
 *
 * 서버가 내려주는 `profileCompletionRequired` 를 그대로 따른다.
 * 승인 대기 회원은 가입정보 입력/검토중 화면에서 처리하므로 홈 시트 대상이 아니다.
 */
export const useAppleProfileSetup = () => {
	const { data: memberResponse } = useQuery(getMyMemberInfoQuery);
	const { data: profileResponse } = useQuery(getMyProfileQuery);

	// 회원 상태가 확정되기 전에는 시트를 열지 않는다. (프로필 응답이 먼저 오면 PENDING 회원에게
	// 시트가 잠깐 떴다가 검토중 화면으로 넘어가는 깜빡임이 생긴다.)
	const isSetupRequired =
		memberResponse !== undefined &&
		memberResponse.data.status !== 'PENDING' &&
		profileResponse?.data.profileCompletionRequired === true;

	return { isSetupRequired };
};
