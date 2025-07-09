'use client';
import Iconttendance3D from '@/assets/icons/icon_attendance_3d.png';
import { Button } from '@/components/ui/button';
import { pressInOutVariatns } from '@/variants';
import { motion } from 'motion/react';
import Image from 'next/image';

const MotionButton = motion.create(Button);

const SessionTopBanner = () => {
	return (
		<div className="bg-background-inverse rounded-[10px] p-5">
			<div className="flex justify-between">
				<p className="text-headline2 text-white font-bold">
					멤버들의 출석 현황을
					<br />
					확인해 주세요.
				</p>
				<Image src={Iconttendance3D} alt="출석체크 아이콘" width={80} height={80} />
			</div>
			<MotionButton {...pressInOutVariatns} className="mt-5 w-full" variant="primary" size="lg">
				출석 현황 확인하기
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>오른쪽 화살표</title>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M3.41699 10C3.41699 9.58579 3.75278 9.25 4.16699 9.25H15.8337C16.2479 9.25 16.5837 9.58579 16.5837 10C16.5837 10.4142 16.2479 10.75 15.8337 10.75H4.16699C3.75278 10.75 3.41699 10.4142 3.41699 10Z"
						fill="white"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M9.46967 3.63666C9.76256 3.34377 10.2374 3.34377 10.5303 3.63666L16.3637 9.47C16.6566 9.76289 16.6566 10.2378 16.3637 10.5307L10.5303 16.364C10.2374 16.6569 9.76256 16.6569 9.46967 16.364C9.17678 16.0711 9.17678 15.5962 9.46967 15.3033L14.7727 10.0003L9.46967 4.69732C9.17678 4.40443 9.17678 3.92956 9.46967 3.63666Z"
						fill="white"
					/>
				</svg>
			</MotionButton>
		</div>
	);
};

export { SessionTopBanner };
