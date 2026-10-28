'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getMyMemberInfoQuery } from '@/remotes/queries/member';

/**
 * 회원 상태에 따라 홈 진입을 대신한다.
 * - 승인 대기(PENDING): 검토중 화면
 * - 반려(REJECTED): 반려 안내 화면
 * - 승인됐지만 계정에서 인증완료 화면을 아직 확인하지 않은 경우: 인증완료 화면
 *   (확인 여부는 서버가 계정별로 관리하므로 다른 기기에서 확인했다면 다시 보이지 않는다.)
 */
export const MemberStatusRedirect = () => {
	const router = useRouter();
	const { data } = useQuery(getMyMemberInfoQuery);
	const status = data?.data.status;
	const hasSeenApprovalWelcome = data?.data.hasSeenApprovalWelcome;

	useEffect(() => {
		if (!status) return;

		if (status === 'PENDING') {
			router.replace('/pending');
			return;
		}

		if (status === 'REJECTED') {
			router.replace('/rejected');
			return;
		}

		// 필드가 없는 응답(undefined)은 확인한 것으로 보고 안내하지 않는다.
		if (hasSeenApprovalWelcome === false) router.replace('/welcome');
	}, [status, hasSeenApprovalWelcome, router]);

	return null;
};
