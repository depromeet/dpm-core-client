'use client';
import { useRouter } from 'next/navigation';
import { XIcon } from 'lucide-react';

export const AfterPartySurveyHeader = () => {
	const router = useRouter();

	const onClose = () => {
		router.replace('/after-party');
	};

	return (
		<header className="relative flex items-center justify-center px-4 py-3">
			<h1 className="font-semibold text-body1 text-gray-900">회식 참여 여부 조사</h1>
			<button type="button" className="absolute right-4" aria-label="닫기" onClick={onClose}>
				<XIcon className="text-gray-500" size={20} />
			</button>
		</header>
	);
};
