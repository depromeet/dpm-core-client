'use client';
import { ArrowRight } from '@dpm-core/shared';
import Image from 'next/image';

import Iconttendance3D from '@/assets/icons/icon_attendance_3d.png';
import { Pressable } from './motion';

const SessionEventCard = () => {
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
			<Pressable className="mt-5 w-full" variant="primary" size="lg">
				출석 현황 확인하기
				<ArrowRight />
			</Pressable>
		</div>
	);
};

export { SessionEventCard };
