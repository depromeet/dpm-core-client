import { AppLayout, fadeInOutVariatns, UserAvatar } from '@dpm-core/shared';
import * as motion from 'motion/react-client';
import Image, { type StaticImageData } from 'next/image';
import { Link } from 'next-view-transitions';
import IconAttendance from '@/assets/icons/icon_attendance.png';
import IconSession from '@/assets/icons/icon_session.png';
import IconSettlement from '@/assets/icons/icon_settlement.png';
import { NavigationBar } from '@/components/navigation-bar';
import { CurrentWeekSession } from './_components/current-week-session';
import { SessionBanner } from './_components/session-banner';
import { SessionCurrentWeekBanner } from './_components/session-current-week-banner';

const UserPage = () => {
	return (
		<AppLayout className="bg-background-normal">
			<NavigationBar>
				<div className="py-2 px-4 flex items-center justify-between bg-white ">
					<h3 className="font-normal ">Dpmcore(Logo)</h3>

					<Link href="/my-page">
						<UserAvatar />
					</Link>
				</div>
				<SessionBanner />
			</NavigationBar>

			<SessionCurrentWeekBanner />

			<motion.div
				variants={fadeInOutVariatns.variants}
				className="flex flex-col divide-y-8 divide-background-strong flex-1"
			>
				<ul className="gap-x-3 flex items-center mt-5 pb-10">
					<IconCard icon={IconAttendance} title="출석" href="/attendance/search?week=1" />
					<IconCard icon={IconSession} title="세션" href="/session" />
					<IconCard icon={IconSettlement} title="정산" href="/settle" />
				</ul>
				<CurrentWeekSession />
			</motion.div>
		</AppLayout>
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
