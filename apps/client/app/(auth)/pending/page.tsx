'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@dpm-core/shared';

import pendingSymbol from '@/assets/images/pending-symbol.svg';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { CLARITY_ACTION_ID } from '@/constants/clarity';
import { memberAuthQueryKey } from '@/providers/auth-provider';
import { useClarity } from '@/providers/client-clarity-adapter';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';
import { getMemberPartLabel } from '@/lib/member/part';

import { CancelApplicationModal } from './_components/cancel-application-modal';

export default function PendingPage() {
	const queryClient = useQueryClient();
	const { track } = useClarity();

	const { data: memberResponse, refetch } = useQuery({
		...getMyMemberInfoQuery,
		refetchIntervalInBackground: false,
	});
	const status = memberResponse?.data.status;

	// 승인(ACTIVE)·반려(REJECTED)로 바뀌면 AuthProvider가 보는 상태 캐시를 갱신해 해당 화면으로 보낸다.
	useEffect(() => {
		if (status && status !== 'PENDING') {
			void queryClient.invalidateQueries({ queryKey: memberAuthQueryKey });
		}
	}, [status, queryClient]);

	const reload = () => {
		window.location.reload();
	};

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
						승인이 완료되면 홈 화면에 접속할 수 있어요
					</p>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col w-[239px] gap-4 bg-[#FFFFFF]/60 rounded-xl px-8 py-6">
						<dl className="flex flex-col">
							<dt className="text-body2 font-medium text-label-tertiary">
								이름
							</dt>
							<dd className="text-title2 font-bold text-label-normal">
								{memberResponse?.data.name}
							</dd>
						</dl>
						<dl className="flex flex-col">
							<dt className="text-body2 font-medium text-label-tertiary">
								직군
							</dt>
							<dd className="text-title2 font-bold text-label-normal">
								{getMemberPartLabel(memberResponse?.data.part)}
							</dd>
						</dl>
					</div>
					<Link
						className="self-center text-body2 font-semibold text-label-subtle"
						href="/pending/edit"
						onClick={() => track(CLARITY_ACTION_ID.PENDING.EDIT_CLICK)}
					>
						개인정보 수정하기
					</Link>
				</div>
			</main>
			<div className="flex flex-col gap-2 px-4 pb-4">
				<Button 
					variant="secondary" 
					size="full" 
					className="h-12 rounded-lg"
					onClick={() => refetch()}
				>
					새로고침
				</Button>
				<CancelApplicationModal>
					<Button variant="assistive" size="full" className="h-12 rounded-lg">
						가입 신청 취소
					</Button>
				</CancelApplicationModal>
			</div>
		</SafeAreaAppLayout>
	);
}
