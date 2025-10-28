import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import Link from 'next/link';

import IconAttendance from '@/assets/icons/icon_attendance.png';
import IconSession from '@/assets/icons/icon_session.png';
import IconSettlement from '@/assets/icons/icon_settlement.png';

import { SESSION_ID } from '../../(attendance)/attendance/search/@tabs/const/const';
import { FeatureComingSoon } from './coming-soon';

export const MobileNav = () => {
	return (
		<nav>
			<ul className="flex items-center justify-center gap-x-[52px]">
				<IconCard
					icon={IconAttendance}
					title="출석"
					href={`/attendance/search/session?week=${SESSION_ID}`}
				/>
				<IconCard icon={IconSession} title="세션" href="/session" />
				<FeatureComingSoon>
					<IconCard icon={IconSettlement} title="정산" href="#" />
				</FeatureComingSoon>
			</ul>
		</nav>
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
