'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from '@dpm-core/shared';

interface AnnouncementDetailBackButtonProps {
	returnTo: '/' | '/announcement';
}

export const AnnouncementDetailBackButton = ({ returnTo }: AnnouncementDetailBackButtonProps) => {
	const router = useRouter();

	return (
		<button
			type="button"
			aria-label="뒤로가기"
			onClick={() => router.replace(returnTo)}
			className="absolute left-4"
		>
			<ChevronLeft />
		</button>
	);
};
