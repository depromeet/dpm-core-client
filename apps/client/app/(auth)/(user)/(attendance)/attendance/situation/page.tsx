import IconDesigner from '@/assets/icons/icon_designer.png';
import { NavigationBar } from '@/components/navigation-bar';
import {
	Avatar,
	Button,
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@dpm-core/shared';

import { CircleMinus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

export default function page() {
	return (
		<Fragment>
			<NavigationBar>
				<h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-body1">
					내 출석 현황
				</h1>
				<Provision />
			</NavigationBar>

			<section className="px-4 mt-5 mb-4">
				<div className="flex justify-between items-center mb-4">
					<div className="flex gap-3 items-center">
						<Avatar className="bg-background-strong size-15 p-1.5">
							<Image src={IconDesigner} fill alt="profile" />
						</Avatar>
						<div className="flex flex-col gap-0.5">
							<span className="text-body1 font-semibold">김한슬</span>
							<p className="flex gap-3 text-label-assistive text-caption1 font-medium">
								<span>1팀</span>
								<span>디자이너</span>
							</p>
						</div>
					</div>
					<span className="flex items-center bg-red-100 text-caption1 font-semibold text-red-500 px-[5px] py-[3px] rounded-sm">
						수료 위험
					</span>
				</div>
				<ul className="bg-background-subtle px-5 py-[18px] flex rounded-xl justify-between text-body2">
					<li>
						<span className="mr-2 text-label-assistive font-medium after:content-[':'] ">출석</span>
						<span className="font-semibold">2회</span>
					</li>
					<li>
						<span className="mr-2 text-label-assistive font-medium after:content-[':']">지각</span>
						<span className="font-semibold">2회</span>
					</li>
					<li>
						<span className="mr-2 text-label-assistive font-medium after:content-[':']">인정</span>
						<span className="font-semibold">2회</span>
					</li>
					<li>
						<span className="mr-2 text-label-assistive font-medium after:content-[':']">결석</span>
						<span className="font-semibold">2회</span>
					</li>
				</ul>
			</section>

			<section className="px-4">
				<Link href="/attendance/situation/123">
					<div className="px-3 py-4 border-b border-line-noraml flex justify-between">
						<div className="text-caption1 text-label-assistive font-medium">
							<p className="mb-0.5">1주차 세션</p>
							<p className="text-label-normal font-semibold mb-1.5">디프만 17 OT</p>
							<p className="flex">
								<span className="mr-2 flex gap-0.5 items-center">
									<svg width="15" height="16" viewBox="0 0 15 16" fill="none">
										<title>달력</title>
										<path
											d="M13.291 11.8838C13.2906 13.0995 12.2285 14.0194 11.0029 14.0195H3.66895C2.44337 14.0194 1.38131 13.0995 1.38086 11.8838V6.20508H13.291V11.8838ZM10.7734 1.63281C11.0247 1.63281 11.2285 1.83663 11.2285 2.08789V2.87012C12.3562 2.97487 13.2909 3.85636 13.291 4.99707V5.14258H1.38086V4.99707C1.38093 3.90092 2.24447 3.04682 3.3125 2.88867V2.08789C3.3125 1.83663 3.51632 1.63281 3.76758 1.63281C4.01879 1.63286 4.22266 1.83667 4.22266 2.08789V2.86035H10.3184V2.08789C10.3184 1.83663 10.5222 1.63281 10.7734 1.63281Z"
											fill="#9CA3AF"
										/>
									</svg>
									2025.08.12 (목)
								</span>
								<span className="flex gap-0.5 items-center">
									<svg width="15" height="16" viewBox="0 0 15 16" fill="none">
										<title>시계</title>
										<path
											d="M7.8125 1.75C11.2643 1.75 14.0625 4.54822 14.0625 8C14.0625 11.4518 11.2643 14.25 7.8125 14.25C4.36072 14.25 1.5625 11.4518 1.5625 8C1.5625 4.54822 4.36072 1.75 7.8125 1.75ZM7.8125 5.1377C7.46732 5.1377 7.1875 5.41752 7.1875 5.7627V8.70312C7.18765 8.972 7.36013 9.21086 7.61523 9.2959L9.72461 9.99902L9.84766 10.0264C10.1363 10.0612 10.4191 9.89007 10.5146 9.60352C10.6238 9.27605 10.4466 8.92165 10.1191 8.8125L8.4375 8.25195V5.7627C8.4375 5.41752 8.15768 5.1377 7.8125 5.1377Z"
											fill="#9CA3AF"
										/>
									</svg>
									14:00
								</span>
							</p>
						</div>
						<div className="flex items-center gap-0.5 text-body2 text-label-subtle font-semibold">
							<CircleMinus fill="#3EA32C" size={20} color="#fff" />
							<span>인정</span>
						</div>
					</div>
				</Link>
			</section>
		</Fragment>
	);
}

const Provision = () => {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					variant="none"
					size="sm"
					className="bg-background-normal text-label-subtle border rounded-[100px] border-line-noraml"
				>
					규정
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>출석 규정 안내</DrawerTitle>
				</DrawerHeader>
			</DrawerContent>
		</Drawer>
	);
};
