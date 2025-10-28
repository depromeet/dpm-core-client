import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import * as motion from 'motion/react-client';
import {
	AppLayout,
	ChevronRight,
	fadeInOutVariatns,
	GAPageTracker,
	TextLogo,
	UserAvatar,
} from '@dpm-core/shared';

import IconAttendance from '@/assets/icons/icon_attendance.png';
import IconSession from '@/assets/icons/icon_session.png';
import IconSettlement from '@/assets/icons/icon_settlement.png';
import { NavigationBar } from '@/components/navigation-bar';

import { CurrentWeekSession } from './_components/current-week-session';
import { SessionCurrentWeekBanner } from './_components/session-top-banner';

const UserPage = () => {
	return (
		<AppLayout className="bg-background-normal">
			<GAPageTracker type="home" />
			<NavigationBar>
				<TextLogo className="text-gray-400" />

				<Link href="/my-page">
					<UserAvatar />
				</Link>
			</NavigationBar>

			<SessionCurrentWeekBanner />

			<motion.div
				variants={fadeInOutVariatns.variants}
				className="flex flex-1 flex-col divide-y-8 divide-background-strong"
			>
				<ul className="mt-5 flex items-center justify-center gap-x-[52px] pb-10">
					<IconCard icon={IconAttendance} title="출석" href="/attendance/me" />
					<IconCard icon={IconSession} title="세션" href="/session" />
					<IconCard icon={IconSettlement} title="정산" href="/bills" />
				</ul>
				<div className="my-5 flex w-full flex-1 flex-col gap-y-5 px-4">
					<CurrentWeekSession />
					<Link
						href="https://forms.gle/yV88T98WsADu6VNc6"
						target="_blank"
						className="flex items-center justify-between rounded-[10px] bg-primary-extralight p-5"
					>
						<div>
							<h3 className="font-bold text-primary-normal text-title2">디프만 코어 VOC 수집중!</h3>
							<p className="mt-2 text-body2 text-label-assistive">
								디프만 코어, 어떻게 느끼고 계신가요?
								<br />
								여러분의 의견을 기다리고 있어요!
							</p>
						</div>
						<ChevronRight className="text-icon-noraml" />
					</Link>
				</div>
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

export default UserPage;
