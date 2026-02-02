'use client';

import { Button, CircleCheck } from '@dpm-core/shared';

interface StaffDinnerCompleteProps {
	onGoToView?: () => void;
}

export const StaffDinnerComplete = ({ onGoToView }: StaffDinnerCompleteProps) => {
	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex flex-1 flex-col items-center justify-center gap-8">
				<CircleCheck size={32} />
				<h1 className="font-bold text-label-normal text-title1">참석 여부 제출 완료</h1>
			</div>

			<section className="px-4 pt-4 pb-4">
				<Button variant="secondary" size="full" className="h-12 rounded-lg" onClick={onGoToView}>
					홈 화면으로
				</Button>
			</section>
		</div>
	);
};
