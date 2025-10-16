'use client';

import { useRouter } from 'next/navigation';

import { Pressable } from '@/components/motion';

export const FloatingButtonContainer = () => {
	const router = useRouter();
	const goToAttendanceMe = () => {
		router.replace('/attendance/me');
	};

	return (
		<Pressable
			variant="secondary"
			size="full"
			className="fixed bottom-0 w-full max-w-lg"
			onClick={goToAttendanceMe}
		>
			내 출석 현황 확인
		</Pressable>
	);
};
