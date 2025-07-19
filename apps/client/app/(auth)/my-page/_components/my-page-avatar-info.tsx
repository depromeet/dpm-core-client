'use client';

import { fadeInOutVariatns } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Suspense } from 'react';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { cohort } from '@/constants/cohort';
import { isExistPart } from '@/lib/utils';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';

const MyPageAvatarInfoContainer = () => {
	const {
		data: { data: myMemberInfo },
	} = useSuspenseQuery(getMyMemberInfoQuery);

	return (
		<motion.div
			variants={fadeInOutVariatns.variants}
			className="flex flex-col items-center gap-y-2.5"
		>
			<div className="w-[120px] h-[120px] rounded-full bg-white overflow-hidden">
				<Image
					// FIXME: 유효하지 않은 파트일 경우 디폴트 이미지
					src={isExistPart(myMemberInfo.part) ? cohort[myMemberInfo.part] : cohort.WEB}
					alt={myMemberInfo.part}
					width={120}
					height={120}
				/>
			</div>
			<div className="flex flex-col text-center gap-y-1">
				<p className="text-title1 font-semibold text-label-normal">{myMemberInfo.name}</p>
				<p className="text-xs text-label-assistive">{myMemberInfo.email}</p>
			</div>
		</motion.div>
	);
};

const MyPageAvatarInfo = ErrorBoundary.with(
	{
		fallback: (props) => {
			return <ErrorBox onReset={() => props.reset()} />;
		},
	},
	() => (
		<Suspense
			fallback={
				<div className="flex flex-col items-center justify-center gap-y-3 flex-1">
					<LoadingBox />
				</div>
			}
		>
			<MyPageAvatarInfoContainer />
		</Suspense>
	),
);

export { MyPageAvatarInfo };
