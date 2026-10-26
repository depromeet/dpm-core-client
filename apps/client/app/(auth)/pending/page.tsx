'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@dpm-core/shared';

import pendingSymbol from '@/assets/images/pending-symbol.svg';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { markAwaitingApproval } from '@/lib/approval-welcome';
import { memberAuthQueryKey } from '@/providers/auth-provider';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';

import { WithdrawModal } from '../my-page/_components/withdraw-modal';

/** 운영진의 승인·반려를 반영하기 위해 검토중 화면에서 회원 상태를 다시 확인하는 간격 */
const MEMBER_STATUS_POLL_INTERVAL_MS = 10_000;

export default function PendingPage() {
	const queryClient = useQueryClient();

	useEffect(() => {
		markAwaitingApproval();
	}, []);

	// 앱 기본 staleTime(5분) 때문에 캐시가 신선하다고 판단되면 화면에 다시 들어오거나 탭에 돌아와도
	// 재조회하지 않는다. staleTime 0 으로 두어 진입·포커스 때마다 바로 한 번 확인한다.
	// 탭이 백그라운드이면 폴링은 멈춘다.
	const { data: memberResponse } = useQuery({
		...getMyMemberInfoQuery,
		staleTime: 0,
		refetchInterval: MEMBER_STATUS_POLL_INTERVAL_MS,
		refetchIntervalInBackground: false,
	});
	const status = memberResponse?.data.status;

	// 승인(ACTIVE)·반려(REJECTED)로 바뀌면 AuthProvider가 보는 상태 캐시를 갱신해 해당 화면으로 보낸다.
	useEffect(() => {
		if (status && status !== 'PENDING') {
			void queryClient.invalidateQueries({ queryKey: memberAuthQueryKey });
		}
	}, [status, queryClient]);

	return (
		<SafeAreaAppLayout className="h-dvh bg-[linear-gradient(158.06deg,#FFFFFF_20.54%,#CFD9FF_60.84%,#E6F9FF_99%)]">
			<main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
				<Image src={pendingSymbol} alt="" priority />
				<div className="flex flex-col gap-4">
					<h1 className="bg-[linear-gradient(110.25deg,#5359D6_30.58%,#0D1A34_60.1%,#737EAE_77.43%)] bg-clip-text font-bold text-headline2 text-transparent tracking-[-0.44px]">
						운영진이 회원 정보를
						<br />
						검토하고 있어요
					</h1>
					<p className="bg-linear-to-r from-label-subtle to-[#7A98C2] bg-clip-text font-medium text-body1 text-transparent">
						승인이 완료되면 홈화면에 접속할 수 있어요
					</p>
				</div>
			</main>
			<div className="flex flex-col gap-2 px-4 pb-4">
				<Button variant="secondary" size="full" className="h-12 rounded-lg" asChild>
					<Link href="/pending/edit">개인정보 수정하기</Link>
				</Button>
				{/* 가입 신청 취소는 현재 계정 탈퇴와 같은 처리를 한다. */}
				<WithdrawModal>
					<Button variant="assistive" size="full" className="h-12 rounded-lg">
						가입 신청 취소
					</Button>
				</WithdrawModal>
			</div>
		</SafeAreaAppLayout>
	);
}
