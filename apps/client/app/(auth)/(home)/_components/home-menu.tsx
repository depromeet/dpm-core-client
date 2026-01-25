'use client';

import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import Link from 'next/link';
import * as motion from 'motion/react-client';
import { Aesterisk, fadeInOutVariatns } from '@dpm-core/shared';

import IconAttendance from '@/assets/icons/icon_attendance.png';
import IconSession from '@/assets/icons/icon_session.png';
import IconSettlement from '@/assets/icons/icon_settlement.png';
import { useAuth } from '@/providers/auth-provider';

import { FeatureComingSoon } from './coming-soon';
import { CurrentWeekSession } from './current-week-session';

export const HomeMenu = () => {
	const { user } = useAuth();

	if (user?.status === 'INACTIVE') {
		return (
			<div className="my-5 flex h-[166px] flex-col items-center justify-center">
				<Aesterisk />
				<p className="font-semibold text-body1 text-label-assistive">
					현재 참여 중인 기수가 없어요.
				</p>
			</div>
		);
	}

	return (
		<motion.div
			variants={fadeInOutVariatns.variants}
			className="flex flex-col divide-y-8 divide-background-strong"
		>
			<ul className="mt-5 flex items-center justify-center gap-x-[52px] pb-10">
				<IconCard icon={IconAttendance} title="출석" href="/attendance/me" />
				<IconCard icon={IconSession} title="세션" href="/session" />
				<FeatureComingSoon>
					<IconCard icon={IconSettlement} title="정산" href="/bills" />
				</FeatureComingSoon>
			</ul>
			<div className="my-5 flex w-full flex-1 flex-col gap-y-5 px-4">
				<CurrentWeekSession />
			</div>
		</motion.div>
	);
};

interface IconCardProps {
	icon: StaticImageData;
	title: string;
	href: string;
}

function IconCard({ icon, title, href }: IconCardProps) {
	return (
		<li>
			<Link
				href={href}
				className="flex flex-col items-center gap-y-2 text-center transition-transform hover:scale-105"
			>
				<div className="flex h-[60px] w-[60px] items-center justify-center rounded-xl bg-background-strong">
					<Image src={icon} width={35} height={35} alt={title} />
				</div>
				<p className="font-semibold text-body2">{title}</p>
			</Link>
		</li>
	);
}
