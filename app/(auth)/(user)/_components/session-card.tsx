'use client';
import { pressInOutVariatns } from '@/variants';
import { motion } from 'motion/react';
import Link from 'next/link';
import { sessionMocks } from '../_session-mock';

const MotionLink = motion.create(Link);

const formatDate = (isoString: string) => {
	const date = new Date(isoString);
	const days = ['일', '월', '화', '수', '목', '금', '토'];
	const year = date.getFullYear().toString().slice(2);
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const dayOfWeek = days[date.getDay()];
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	return `${year}년 ${month}월 ${day}일 (${dayOfWeek}) ${hours}:${minutes}`;
};

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
						{formatDate(currentMock.datetime)}
					</span>
				</div>
				<div className="gap-x-4 flex">
					<span className="text-body2 font-semibold text-label-assistive w-[70px]">세션 장소</span>
					<span className="inline-flex text-body2 text-label-subtle">
						{formatDate(currentMock.datetime)}
					</span>
				</div>
			</div>
		</MotionLink>
	);
};

export { SessionCard };
