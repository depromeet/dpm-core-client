'use client';

import { CircleCheck, cn } from '@dpm-core/shared';

interface ReadButtonProps {
	readCount: number;
	isRead: boolean;
	showTooltip: boolean;
	onClick: () => void;
}

export const ReadButton = ({ readCount, isRead, showTooltip, onClick }: ReadButtonProps) => {
	return (
		<div className="relative inline-flex">
			{showTooltip && (
				<div className="absolute bottom-[calc(100%+8px)] left-0 flex items-center justify-center rounded-lg bg-background-inverse px-2 py-1.5">
					<p className="text-center text-caption1 font-medium text-white">
						공지를 숙지했다면 <br />
						읽음 버튼을 눌러주세요!
					</p>
					<div
						className="absolute -bottom-1.25 left-1/2 h-1.25 w-[11.5px] -translate-x-1/2 bg-background-inverse"
						style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
					/>
				</div>
			)}
			<button
				type="button"
				onClick={onClick}
				disabled={isRead}
				className={cn(
					'text-body3 flex h-10 cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-[38px] border px-4 font-semibold',
					isRead
						? 'pointer-events-none border-primary-normal bg-primary-extralight'
						: 'bg-comp-fill-white border-line-normal tracking-tight text-label-alternative',
				)}
			>
				<CircleCheck size={20} color={isRead ? '#5e83fe' : '#9CA3AF'} />
				<span>읽었어요! · {readCount}</span>
			</button>
		</div>
	);
};
