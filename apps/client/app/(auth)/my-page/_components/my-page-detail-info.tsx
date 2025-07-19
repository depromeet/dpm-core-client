'use client';

import { ChevronRight, fadeInOutVariatns } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useIsMutating, useSuspenseQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Suspense } from 'react';
import { LogoutBottomSheet } from '@/components/bottom-sheet/logout-bottom-sheet';
import { WithdrawBottomSheet } from '@/components/bottom-sheet/withdraw-bottom-sheet';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { Pressable } from '@/components/motion';
import { formatCohort } from '@/lib/format';
import { logoutMutationOptions } from '@/remotes/mutations/auth';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';
import { MypPageBox } from './my-page-box';

const MyPageDetailInfoContainer = () => {
	const {
		data: { data: myMemberInfo },
	} = useSuspenseQuery(getMyMemberInfoQuery);

	return (
		<motion.div
			variants={fadeInOutVariatns.variants}
			className="flex flex-col gap-y-2 p-[30px] px-4 flex-1"
		>
			<MypPageBox className="flex flex-col gap-y-5">
				<div className="flex flex-col gap-y-2">
					<p className="text-body2 text-label-assistive font-semibold">메일</p>
					<p className="text-body2 text-label-subtle">{myMemberInfo.email}</p>
				</div>
				<div className="flex flex-col gap-y-2">
					<p className="text-body2 text-label-assistive font-semibold">기수</p>
					<p className="text-body2 text-label-subtle">{formatCohort(myMemberInfo.cohort)}기</p>
				</div>
			</MypPageBox>
			<MyPageDetailWithdrawBox />
		</motion.div>
	);
};

function MyPageDetailWithdrawBox() {
	const isMutating = useIsMutating({ mutationKey: [logoutMutationOptions().mutationKey] });

	return (
		<MypPageBox className="flex flex-col gap-y-5">
			<p className="text-body2 text-label-assistive font-semibold">계정 관리</p>
			<LogoutBottomSheet>
				<Pressable
					disabled={!!isMutating}
					variant="text"
					className="flex items-center justify-between p-0 font-medium"
				>
					<p className="text-body2 text-label-subtle">로그아웃</p>
					<ChevronRight className="w-6 h-6 text-icon-noraml" />
				</Pressable>
			</LogoutBottomSheet>
			<WithdrawBottomSheet>
				<Pressable variant="text" className="flex items-center justify-between p-0 font-medium">
					<p className="text-body2 text-label-subtle">탈퇴하기</p>
					<ChevronRight className="w-6 h-6 text-icon-noraml" />
				</Pressable>
			</WithdrawBottomSheet>
		</MypPageBox>
	);
}

const MyPageDetailInfo = ErrorBoundary.with(
	{
		fallback: (props) => {
			return <ErrorBox onReset={() => props.reset()} />;
		},
	},
	() => {
		return (
			<Suspense
				fallback={
					<div className="flex flex-col items-center justify-center gap-y-3 flex-1">
						<LoadingBox />
					</div>
				}
			>
				<MyPageDetailInfoContainer />
			</Suspense>
		);
	},
);

export { MyPageDetailInfo };
