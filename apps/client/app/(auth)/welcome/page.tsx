'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@dpm-core/shared';

import bgEllipse from '@/assets/images/welcome-bg-ellipse.svg';
import cardEllipse from '@/assets/images/welcome-card-ellipse.svg';
import cardTexture from '@/assets/images/welcome-card-texture.png';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { cohort } from '@/constants/cohort';
import { clearAwaitingApproval } from '@/lib/approval-welcome';
import { isExistPart } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

/** 승인(인증) 완료 후 처음 홈에 들어올 때 한 번 보여주는 화면 */
export default function WelcomePage() {
	const { user } = useAuth();

	useEffect(() => {
		clearAwaitingApproval();
	}, []);

	if (!user) return null;

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
				asChild
			>
				<Link href="/" replace>
					디프만 {user.cohort}기 입장하기 →
				</Link>
			</Button>
		</SafeAreaAppLayout>
	);
}
