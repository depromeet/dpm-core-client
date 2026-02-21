'use client';

import Image from 'next/image';
import { Suspense } from 'react';
import { ErrorBoundary, type ErrorBoundaryFallbackProps } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { fadeInOutVariatns } from '@dpm-core/shared';

import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { cohort } from '@/constants/cohort';
import { isExistPart } from '@/lib/utils';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';

const MyPageAvatarInfoContainer = () => {
	const {
		data: { data: myMemberInfo },
	} = useSuspenseQuery(getMyMemberInfoQuery);

	const part = isExistPart(myMemberInfo.part) ? myMemberInfo.part : 'WEB';

	return (
		<motion.div
			variants={fadeInOutVariatns.variants}
			className="flex flex-col items-center gap-y-2.5"
		>
			<div className="h-[120px] w-[120px] overflow-hidden rounded-full bg-white">
				<Image
					// FIXME: 유효하지 않은 파트일 경우 디폴트 이미지
					src={cohort[part].icon}
					alt={myMemberInfo.part}
					width={120}
					height={120}
					priority
				/>
			</div>
			<div className="flex flex-col gap-y-1 text-center">
				<p className="font-semibold text-label-normal text-title1">{myMemberInfo.name}</p>
				<p className="text-label-assistive text-xs">{cohort[part].label}</p>
			</div>
		</motion.div>
	);
};

const MyPageAvatarInfo = ErrorBoundary.with(
	{
		fallback: ({ reset }: ErrorBoundaryFallbackProps<Error>) => {
			return <ErrorBox onReset={reset} />;
		},
	},
	() => (
		<Suspense
			fallback={
				<div className="flex flex-1 flex-col items-center justify-center gap-y-3">
					<LoadingBox />
				</div>
			}
		>
			<MyPageAvatarInfoContainer />
		</Suspense>
	),
);

export { MyPageAvatarInfo };
