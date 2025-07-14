'use client';
import { pressInOutVariatns } from '@dpm-core/shared';

import { MotionLink } from '@/apps/admin/components/motion';
import { formatISOStringToFullDateString } from '@/apps/admin/lib/date';
import { sessionMocks } from '../_session-mock';

const SessionCard = () => {
	const currentMock = sessionMocks[0];

	return (
		<MotionLink
			{...pressInOutVariatns}
			href="#"
			className="bg-background-subtle flex flex-col rounded-lg p-5"
		>
			<small className="text-label-subtle text-caption1">{currentMock.week}주차 세션</small>
			<h3 className="text-body1 font-semibold ">{currentMock.title}</h3>
			<div className="my-4 bg-line-noraml w-full h-px" />
			<div className="gap-y-3 flex flex-col">
				<div className="gap-x-4 flex">
					<span className="text-body2 font-semibold text-label-assistive w-[70px]">세션 시간</span>
					<span className="inline-flex text-body2 text-label-subtle">
						{formatISOStringToFullDateString(currentMock.datetime)}
					</span>
				</div>
				<div className="gap-x-4 flex">
					<span className="text-body2 font-semibold text-label-assistive w-[70px]">세션 장소</span>
					<span className="inline-flex text-body2 text-label-subtle">
						{formatISOStringToFullDateString(currentMock.datetime)}
					</span>
				</div>
			</div>
		</MotionLink>
	);
};

export { SessionCard };
