'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, Member } from '@dpm-core/api';
import { Button, toast } from '@dpm-core/shared';

import bgEllipse from '@/assets/images/welcome-bg-ellipse.svg';
import cardEllipse from '@/assets/images/welcome-card-ellipse.svg';
import cardTexture from '@/assets/images/welcome-card-texture.png';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { CLARITY_ACTION_ID } from '@/constants/clarity';
import { cohort } from '@/constants/cohort';
import { isExistPart } from '@/lib/utils';
import { memberAuthQueryKey, useAuth } from '@/providers/auth-provider';
import { useClarity } from '@/providers/client-clarity-adapter';
import { confirmApprovalWelcomeMutationOptions } from '@/remotes/mutations/member';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';

const markApprovalWelcomeSeen = (old: ApiResponse<Member> | undefined) =>
	old && { ...old, data: { ...old.data, hasSeenApprovalWelcome: true } };

/** 승인(인증) 완료 후 계정당 한 번 보여주는 화면. 확인 여부는 서버가 계정별로 기록한다. */
export default function WelcomePage() {
	const { user } = useAuth();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { track } = useClarity();

	const { mutate: confirmWelcome, isPending } = useMutation(
		confirmApprovalWelcomeMutationOptions({
			onSuccess: () => {
				track(CLARITY_ACTION_ID.WELCOME.ENTER_SUCCESS);
				// 홈의 리다이렉트가 이전 캐시(false)를 보고 다시 이 화면으로 되돌리지 않도록 먼저 맞춘다.
				queryClient.setQueryData(getMyMemberInfoQuery.queryKey, markApprovalWelcomeSeen);
				queryClient.setQueryData(memberAuthQueryKey, markApprovalWelcomeSeen);
				router.replace('/');
			},
			onError: (error) => {
				track(CLARITY_ACTION_ID.WELCOME.ENTER_FAIL);
				// 승인 전 회원이면 서버가 409 를 준다. 상태를 다시 받아 AuthProvider 가 알맞은 화면으로 보내게 한다.
				if (error.response?.status === 409) {
					void queryClient.invalidateQueries({ queryKey: memberAuthQueryKey });
					void queryClient.invalidateQueries({ queryKey: getMyMemberInfoQuery.queryKey });
					return;
				}
				toast.error('입장에 실패했어요. 다시 시도해주세요.');
			},
		}),
	);

	// 주소로 직접 들어오거나, 다른 기기에서 이미 확인한 경우에는 이 화면을 다시 보여주지 않는다.
	const { data: memberResponse } = useQuery(getMyMemberInfoQuery);
	const hasSeenApprovalWelcome = memberResponse?.data.hasSeenApprovalWelcome === true;

	useEffect(() => {
		if (hasSeenApprovalWelcome) router.replace('/');
	}, [hasSeenApprovalWelcome, router]);

	if (!user || hasSeenApprovalWelcome) return null;

	const part = isExistPart(user.part) ? user.part : 'ETC';

	return (
		<SafeAreaAppLayout className="relative h-dvh items-center overflow-hidden bg-background-normal">
			<Image
				src={bgEllipse}
				alt=""
				aria-hidden
				className="-bottom-[381px] -translate-x-1/2 pointer-events-none absolute left-1/2 max-w-none"
			/>
			<h1 className="relative mt-24 text-center font-bold text-headline2 text-label-normal tracking-[-0.44px]">
				디프만 {user.cohort}기 멤버 {user.name}님,
				<br />
				멤버 인증이 완료되었어요
			</h1>

			<div className="relative mt-15 h-65 w-53.5 overflow-hidden rounded-xl border border-[rgba(137,151,175,0.1)] bg-background-normal shadow-[0_1px_12px_0_rgba(104,120,149,0.1)]">
				<div className="absolute inset-x-0 bottom-0 h-8.5 bg-[#E3E7EC]" />
				<Image
					src={cardTexture}
					alt=""
					aria-hidden
					className="-top-1.5 -left-2 absolute h-68 w-57.75 max-w-none opacity-30"
				/>
				<div className="relative flex flex-col items-center gap-3.5 pt-8">
					<div className="flex size-23 items-center justify-center rounded-full bg-background-normal">
						<Image
							src={cohort[part].icon}
							alt={`${cohort[part].label}_프로필_이미지`}
							width={61}
							height={61}
							priority
						/>
					</div>
					<div className="flex flex-col items-center gap-1">
						<p className="font-bold text-[20.71px] text-label-normal leading-[1.44]">{user.name}</p>
						<p className="font-medium text-[13.8px] text-label-subtle leading-[1.33]">
							{cohort[part].label}
						</p>
					</div>
				</div>
				<p className="absolute inset-x-0 bottom-0 flex h-8.5 items-center justify-center font-semibold text-body2 text-label-subtle">
					DPM {user.cohort}th
				</p>
				<Image
					src={cardEllipse}
					alt=""
					aria-hidden
					className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 max-w-none mix-blend-overlay"
				/>
			</div>

			<Button
				variant="primary"
				className="relative mt-12.75 h-14 w-70 rounded-lg font-semibold text-body1"
				loading={isPending}
				onClick={() => {
					track(CLARITY_ACTION_ID.WELCOME.ENTER_CLICK);
					confirmWelcome();
				}}
			>
				디프만 {user.cohort}기 입장하기 →
			</Button>
		</SafeAreaAppLayout>
	);
}
