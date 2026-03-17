'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSuspenseQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { ArrowRight, Button, fadeInOutVariatns } from '@dpm-core/shared';

import Iconttendance3D from '@/assets/icons/icon_attendance_3d.png';
import { showAttendanceBanner } from '@/lib/attendance/banner';
import { formatSessionWeekString } from '@/lib/session/format';
import { getSessionCurrentOptions } from '@/remotes/queries/session';

export const HomeCheckAttendanceBanner = () => {
	const {
		data: { data: attendanceSession },
	} = useSuspenseQuery(getSessionCurrentOptions());

	if (
		!attendanceSession ||
		!showAttendanceBanner(attendanceSession.attendanceStart, attendanceSession.lateStart)
	) {
		return null;
	}

	return (
		<motion.div
			variants={{
				...fadeInOutVariatns.variants,
				initial: { ...fadeInOutVariatns.variants.initial, y: -20 },
			}}
			className="px-4 pt-5 pb-7.5"
		>
			<div className="rounded-[10px] bg-background-inverse p-5">
				<div className="flex justify-between">
					<div>
						<p className="mb-1 font-semibold text-caption1 text-label-assistive">
							{`${formatSessionWeekString(attendanceSession.week)} 출석`}
						</p>
						<p className="font-bold text-headline2 text-white">
							출석체크를
							<br />
							진행해 주세요.
						</p>
					</div>
					<Image
						src={Iconttendance3D}
						alt="출석체크 아이콘"
						width={80}
						height={80}
						className="mt-2.5"
					/>
				</div>
				<Button className="mt-5 w-full" variant="primary" size="lg" asChild>
					<Link href={`/attendance/${attendanceSession.id}`}>
						출석체크하기
						<ArrowRight />
					</Link>
				</Button>
			</div>
		</motion.div>
	);
};
