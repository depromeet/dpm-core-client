import { AppLayout, ChevronRight, fadeInOutVariatns, TextLogo, UserAvatar } from '@dpm-core/shared';
import * as motion from 'motion/react-client';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import IconAttendance from '@/assets/icons/icon_attendance.png';
import IconSession from '@/assets/icons/icon_session.png';
import IconSettlement from '@/assets/icons/icon_settlement.png';
import { NavigationBar } from '@/components/navigation-bar';
import { FeatureComingSoon } from './_components/coming-soon';
import { SessionList } from './_components/session-list';
import { SessionCurrentWeekBanner } from './_components/session-top-banner';

const UserPage = () => {
	return (
		<AppLayout className="bg-background-normal">
			<NavigationBar>
				<TextLogo className="text-gray-400" />

				<Link href="/my-page">
					<UserAvatar />
				</Link>
			</NavigationBar>

			<SessionCurrentWeekBanner />

			<motion.div
				variants={fadeInOutVariatns.variants}
				className="flex flex-col divide-y-8 divide-background-strong flex-1"
			>
				<ul className="flex justify-center items-center gap-x-[52px] mt-5 pb-10">
					<IconCard icon={IconAttendance} title="출석" href="/attendance/me" />
					<IconCard icon={IconSession} title="세션" href="/session" />
					<FeatureComingSoon>
						<IconCard icon={IconSettlement} title="정산" href="#" />
					</FeatureComingSoon>
				</ul>
				<div className="flex flex-col my-5 px-4 w-full gap-y-5 flex-1">
					<SessionList />
					<Link
						href="https://forms.gle/yV88T98WsADu6VNc6"
						target="_blank"
						className="bg-primary-extralight rounded-[10px] p-5 flex justify-between items-center"
					>
						<div>
							<h3 className="text-title2 font-bold text-primary-normal">디프만 코어 VOC 수집중!</h3>
							<p className="text-body2 text-label-assistive mt-2">
								디프만 코어, 어떻게 느끼고 계신가요?
								<br />
								여러분의 의견을 기다리고 있어요!
							</p>
						</div>
						<ChevronRight />
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
