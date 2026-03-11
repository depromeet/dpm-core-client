'use client';

import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import Link from 'next/link';
import { useSuspenseQuery } from '@tanstack/react-query';

import IconAttendance from '@/assets/icons/icon_attendance.png';
import IconHome from '@/assets/icons/icon_home.png'; // [TODO]: 멤버관리 아이콘 준비되면 교체 필요
import IconSession from '@/assets/icons/icon_session.png';
import { getSessionWeeks } from '@/remotes/queries/session';

export const MobileNav = () => {
	return (
		<nav>
			<ul className="flex items-center justify-center gap-x-13">
				<AttendanceIconCard icon={IconAttendance} title="출석" href="/attendance/search/session" />
				<IconCard icon={IconSession} title="세션" href="/session" />
				<IconCard icon={IconHome} title="멤버 관리" href="/member" />
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
				<div className="flex h-15 w-15 items-center justify-center rounded-xl bg-background-strong">
					<Image src={icon} width={35} height={35} alt={title} />
				</div>
				<p className="font-semibold text-body2">{title}</p>
			</Link>
		</li>
	);
}

const AttendanceIconCard = (props: IconCardProps) => {
	const {
		data: { data: sessionWeek },
	} = useSuspenseQuery(getSessionWeeks());

	return <IconCard {...props} href={`${props.href}?week=${sessionWeek?.sessions[0]?.id}`} />;
};
