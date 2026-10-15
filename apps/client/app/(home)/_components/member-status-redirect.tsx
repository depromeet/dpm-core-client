'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { isAwaitingApproval } from '@/lib/approval-welcome';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';

/**
 * 회원 상태에 따라 홈 진입을 대신한다.
 * - 승인 대기(PENDING): 검토중 화면
 * - 검토중 화면을 봤던 회원이 승인된 뒤 처음 들어온 경우: 인증완료 화면
 */
export const MemberStatusRedirect = () => {
	const router = useRouter();
	const { data } = useQuery(getMyMemberInfoQuery);
	const status = data?.data.status;

	useEffect(() => {
		if (!status) return;

		if (status === 'PENDING') {
			router.replace('/pending');
			return;
		}

		if (isAwaitingApproval()) router.replace('/welcome');
	}, [status, router]);

	return null;
};
