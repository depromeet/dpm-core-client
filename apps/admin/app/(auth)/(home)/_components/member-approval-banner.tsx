'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from '@dpm-core/shared';

import { Section } from '@/components/section';
import { getPendingMemberCountQuery } from '@/remotes/queries/member';

export const MemberApprovalBanner = () => {
	const { data: pendingCount } = useQuery(getPendingMemberCountQuery);

	if (pendingCount == null || pendingCount <= 0) return null;

	return (
		<Section className="mt-8">
			<Link
				href="/member"
				className="relative flex h-33.5 w-full flex-col justify-between rounded-[10px] bg-background-inverse p-5 max-md:h-50"
			>
				<div className="flex flex-col items-start">
					<p className="text-caption1 leading-[133%] font-semibold text-label-assistive">
						멤버 승인
					</p>
					<p className="text-headline2 leading-[136%] font-bold tracking-[-0.02em] text-white">
						새로운 멤버 승인 요청이
						<br />
						{pendingCount}개 들어왔어요.
					</p>
				</div>
				<div className="absolute right-5 bottom-5 rounded-full bg-blue-400 p-2.5">
					<ArrowRight />
				</div>
			</Link>
		</Section>
	);
};
