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
					<p className="text-center font-medium text-caption1 text-white">
						공지를 숙지했다면 <br />
						읽음 버튼을 눌러주세요!
					</p>
					<div
						className="-bottom-1.25 -translate-x-1/2 absolute left-1/2 h-[5px] w-[11.5px] bg-background-inverse"
						style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
					/>
				</div>
			)}
			<button
				type="button"
				onClick={onClick}
				disabled={isRead}
				className={cn(
					'flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-[38px] border',
					isRead
						? 'border-primary-normal bg-primary-extralight px-2.5'
						: 'gap-1.5 border-line-normal bg-comp-fill-white px-4 font-semibold text-body3 text-label-alternative tracking-tight',
				)}
			>
				<CircleCheck size={20} color={isRead ? '#5e83fe' : '#9CA3AF'} />
				{!isRead && <span>읽었어요! · {readCount}</span>}
			</button>
		</div>
	);
};
