'use client';

import { useRouter } from 'next/navigation';

import { Pressable } from '@/components/motion';

export const FloatingButtonContainer = () => {
	const router = useRouter();
	const goToAttendanceMe = () => {
		router.replace('/attendance/me');
	};

	return (
		<section className="px-4 py-4">
			<Pressable
				variant="secondary"
				size="lg"
				className="relative w-full max-w-lg"
				onClick={goToAttendanceMe}
			>
				내 출석 현황 확인
			</Pressable>
		</section>
	);
};
