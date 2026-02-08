'use client';

import { useRouter } from 'next/navigation';
import { CircleCheck } from 'lucide-react';
import { AppLayout, Button } from '@dpm-core/shared';

const StaffTogetherCreateCompletePage = () => {
	const router = useRouter();

	const handleGoHome = () => {
		router.replace('/after-party');
	};

	return (
		<AppLayout className="flex flex-col bg-white">
			{/* 메인 컨텐츠 - 중앙 정렬 */}
			<div className="flex flex-1 flex-col items-center justify-center">
				<CircleCheck className="h-[56px] w-[56px] fill-[#5E83FE] text-white" />
				<h1 className="mt-4 font-semibold text-[#111827] text-[18px] leading-[144%]">
					회식 생성 완료
				</h1>
			</div>

			{/* 하단 버튼 */}
			<div className="px-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
				<Button
					variant="secondary"
					size="full"
					className="h-[48px] rounded-lg bg-[#1F2937] font-semibold text-[16px] text-white leading-[150%] hover:bg-[#1F2937]/90"
					onClick={handleGoHome}
				>
					홈 화면으로
				</Button>
			</div>
		</AppLayout>
	);
};

export default StaffTogetherCreateCompletePage;
