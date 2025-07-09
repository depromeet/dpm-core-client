import { NavigationBar } from '@/components/navigation-bar';
import Image, { type StaticImageData } from 'next/image';

import IconAttendance from '@/assets/icons/icon_attendance.png';
import IconSession from '@/assets/icons/icon_session.png';
import IconSettlement from '@/assets/icons/icon_settlement.png';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';

import { fadeInOutVariatns } from '@/variants';
import * as motion from 'motion/react-client';
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
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Dpmcore(Logo)</title>
							<g clipPath="url(#clip0_1250_4198)">
								<rect width="24" height="24" rx="12" fill="#F3F4F6" />
								<g clipPath="url(#clip1_1250_4198)">
									<path
										d="M11.7318 12.4591C13.7151 12.4591 15.3229 10.8513 15.3229 8.86799C15.3229 6.88466 13.7151 5.27686 11.7318 5.27686C9.74843 5.27686 8.14062 6.88466 8.14062 8.86799C8.14062 10.8513 9.74843 12.4591 11.7318 12.4591Z"
										fill="#9CA3AF"
										stroke="#9CA3AF"
										strokeWidth="1.59606"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M19.4483 21.9349C19.4483 23.3897 18.5173 23.898 12 23.898C5.48279 23.898 4.55176 23.3897 4.55176 21.9349C4.55176 20.4802 5.33648 19.085 6.73331 18.0563C8.13013 17.0276 10.0246 16.4497 12 16.4497C13.9754 16.4497 15.8699 17.0276 17.2668 18.0563C18.6636 19.085 19.4483 20.4802 19.4483 21.9349Z"
										fill="#9CA3AF"
										stroke="#9CA3AF"
										strokeWidth="1.59606"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</g>
							</g>
							<defs>
								<clipPath id="clip0_1250_4198">
									<rect width="24" height="24" rx="12" fill="white" />
								</clipPath>
								<clipPath id="clip1_1250_4198">
									<rect
										width="22.3448"
										height="22.3448"
										fill="white"
										transform="translate(0.827148 2.48291)"
									/>
								</clipPath>
							</defs>
						</svg>
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
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					{' '}
					<title>chevron-right</title>
					<path
						d="M7.03033 2.46967C6.73744 2.17678 6.26268 2.17678 5.96978 2.46967C5.67689 2.76256 5.67689 3.23732 5.96978 3.53022L12.4395 9.99994L5.96978 16.4697L5.91803 16.5263C5.67772 16.8209 5.69518 17.2556 5.96978 17.5302C6.24439 17.8048 6.67911 17.8223 6.97369 17.582L7.03033 17.5302L14.0303 10.5302C14.3232 10.2373 14.3232 9.76256 14.0303 9.46967L7.03033 2.46967Z"
						fill="white"
					/>
				</svg>
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
