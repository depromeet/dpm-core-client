import { ChevronRight } from 'lucide-react';
import * as motion from 'motion/react-client';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';

import { fadeInOutVariatns } from '@dpm-core/shared';

import { NavigationBar } from '@/apps/admin/components/navigation-bar';
import { Popover, PopoverContent, PopoverTrigger, UserAvatar } from '@dpm-core/shared';

import IconAttendance from '@/apps/admin/assets/icons/icon_attendance.png';
import IconSession from '@/apps/admin/assets/icons/icon_session.png';
import IconSettlement from '@/apps/admin/assets/icons/icon_settlement.png';

import { SessionCard } from './_components/session-card';
import { SessionTopBanner } from './_components/session-top-banner';

const UserPage = () => {
	return (
		<motion.div
			className="h-full w-full"
			initial="initial"
			animate="animate"
			transition={{
				staggerChildren: 0.2,
				delay: 1,
			}}
		>
			<NavigationBar>
				<h3 className="font-normal ">Dpmcore(Logo)</h3>

				<Popover>
					<PopoverTrigger>
						<UserAvatar />
					</PopoverTrigger>
					<PopoverContent className="bg-white w-fit flex flex-col">
						<Link href="#">로그아웃</Link>
						<Link href="#">마이페이지</Link>
						<Link href="#">프로필 수정</Link>
					</PopoverContent>
				</Popover>
			</NavigationBar>

			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="py-3 px-4 bg-primary-normal flex items-center justify-between"
			>
				<p className="text-white">2주차 세션 출석 코드 : 0000</p>
				<ChevronRight />
			</motion.div>
			<motion.div variants={fadeInOutVariatns.variants} className="pt-5 px-4 pb-[30px]">
				<SessionTopBanner />
			</motion.div>
			<motion.div
				variants={fadeInOutVariatns.variants}
				className="flex flex-col divide-y-8 divide-background-strong"
			>
				<ul className="gap-x-3 flex items-center mt-5 pb-10">
					<IconCard icon={IconAttendance} title="출석" />
					<IconCard icon={IconSession} title="세션" />
					<IconCard icon={IconSettlement} title="정산" />
				</ul>
				<div className="my-5 px-4">
					<SessionCard />
				</div>
			</motion.div>
		</motion.div>
	);
};

interface IconCardProps {
	icon: StaticImageData;
	title: string;
}

function IconCard({ icon, title }: IconCardProps) {
	return (
		<li className="flex-1">
			<Link className="flex flex-col items-center text-center gap-y-2 " href="">
				<div className="rounded-xl bg-background-strong w-[60px] h-[60px] flex items-center justify-center">
					<Image src={icon} width={35} height={35} alt={title} />
				</div>
				<p className="text-body2 font-semibold">{title}</p>
			</Link>
		</li>
	);
}

export default UserPage;
