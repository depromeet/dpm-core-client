import { fadeInOutVariatns, UserAvatar } from '@dpm-core/shared';
import * as motion from 'motion/react-client';
import Image, { type StaticImageData } from 'next/image';
import { Link } from 'next-view-transitions';
import IconAttendance from '@/assets/icons/icon_attendance.png';
import IconSession from '@/assets/icons/icon_session.png';
import IconSettlement from '@/assets/icons/icon_settlement.png';
import { NavigationBar } from '@/components/navigation-bar';
import { SessionList } from './_components/session-list';
import { SessionCurrentWeekBanner } from './_components/session-top-banner';

const UserPage = () => {
	return (
		<motion.div
			className="w-full flex flex-col min-h-[inherit]"
			initial="initial"
			animate="animate"
			transition={{
				staggerChildren: 0.2,
				delay: 1,
			}}
		>
			<NavigationBar>
				<h3 className="font-normal ">Dpmcore(Logo)</h3>

				<Link href="/my-page">
					<UserAvatar />
				</Link>
			</NavigationBar>

			<SessionCurrentWeekBanner />

			<motion.div
				variants={fadeInOutVariatns.variants}
				className="flex flex-col divide-y-8 divide-background-strong flex-1"
			>
				<ul className="gap-x-3 flex items-center mt-5 pb-10">
					<IconCard icon={IconAttendance} title="출석" href="/attendance" />
					<IconCard icon={IconSession} title="세션" href="/session" />
					<IconCard icon={IconSettlement} title="정산" href="/settlement" />
				</ul>
				<SessionList />
			</motion.div>
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
		<li className="flex-1">
			<Link
				href={href}
				className="flex flex-col items-center text-center gap-y-2 hover:scale-105 transition-transform"
			>
				<div className="rounded-xl bg-background-strong w-[60px] h-[60px] flex items-center justify-center">
					<Image src={icon} width={35} height={35} alt={title} />
				</div>
				<p className="text-body2 font-semibold">{title}</p>
			</Link>
		</li>
	);
}

export default UserPage;
