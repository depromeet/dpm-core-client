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
				className="flex h-[134px] w-full flex-col justify-between rounded-[10px] bg-gray-800 p-5"
			>
				<div className="flex flex-col items-start gap-2.5">
					<p className="font-semibold text-caption1 text-white leading-[133%]">멤버 승인</p>
					<p className="font-bold text-headline2 text-white leading-[136%] tracking-[-0.02em]">
						새로운 멤버 승인 요청이 {pendingCount}개 들어왔어요
					</p>
				</div>
				<div className="flex size-10 shrink-0 items-center justify-center self-end rounded-full bg-[#5E83FE] p-2.5">
					<ArrowRight className="size-5 text-white" />
				</div>
			</Link>
		</Section>
	);
};
