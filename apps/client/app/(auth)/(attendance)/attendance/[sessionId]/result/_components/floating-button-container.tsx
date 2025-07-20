'use client';

import { pressInOutVariatns } from '@dpm-core/shared';
import { useRouter } from 'next/navigation';
import { MotionButton } from '@/components/motion';

export const FloatingButtonContainer = () => {
	const router = useRouter();
	const goToAttendanceMe = () => {
		router.replace('/attendance/me');
	};

	return (
		<MotionButton
			variant="secondary"
			size="full"
			className="fixed max-w-lg w-full bottom-0"
			onClick={goToAttendanceMe}
			{...pressInOutVariatns}
		>
			내 출석 현황 확인
		</MotionButton>
	);
};
