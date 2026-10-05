'use client';

import type { PropsWithChildren } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Aesterisk } from '@dpm-core/shared';

import { Empty, EmptyHeader, EmptyTitle } from '@/components/empty';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';

import { PendingNotice } from './pending-notice';

/**
 * 승인 대기(PENDING) 회원은 출석/세션 데이터 대신 검토 안내와 빈 세션 카드를 보여준다.
 * 그 외 회원은 전달받은 홈 콘텐츠를 그대로 렌더링한다.
 */
export const HomeContent = ({ children }: PropsWithChildren) => {
	const { data } = useQuery(getMyMemberInfoQuery);

	if (data?.data.status !== 'PENDING') return children;

	return (
		<>
			<PendingNotice />
			<section className="my-2 px-4">
				<Empty className="min-h-43.5 rounded-lg bg-background-normal shadow-[0_0_10px_rgba(0,0,0,0.04)]">
					<EmptyHeader>
						<Aesterisk />
						<EmptyTitle>아직 등록된 세션 정보가 없어요</EmptyTitle>
					</EmptyHeader>
				</Empty>
			</section>
		</>
	);
};
