'use client';

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import type { MemberActivityStatus as ActivityStatus } from '@dpm-core/api';
import { cn } from '@dpm-core/shared';

interface MemberActivityStatusProps {
	status: ActivityStatus;
	editable?: boolean;
	onClick?: () => void;
}

const DOT_COLOR: Record<ActivityStatus, string> = {
	NORMAL: 'bg-green-500',
	AT_RISK: 'bg-green-500',
	INACTIVE: 'bg-label-assistive',
};

/**
 * 활동 상태 셀.
 * 수료 위험은 "활동 중" 옆에 별도 배지로 붙는다 (서버가 계산하는 값이라 직접 고를 수 없다).
 *
 * InlineOptionSelect 의 asChild 트리거로 쓰이므로 ref 를 실제 DOM 요소에 전달해야
 * Radix 가 드롭다운 위치를 올바르게 잴 수 있다 (MemberFieldChip 의 설명 참고).
 */
export const MemberActivityStatus = forwardRef<
	HTMLButtonElement | HTMLDivElement,
	MemberActivityStatusProps
>(({ status, editable = false, onClick, ...props }, ref) => {
	const content = (
		<>
			<span className={cn('size-2 shrink-0 rounded-full', DOT_COLOR[status])} />
			<span className="font-semibold text-body2 text-label-normal">
				{status === 'INACTIVE' ? '활동 정지' : '활동 중'}
			</span>
			{status === 'AT_RISK' && (
				<span className="rounded-md bg-red-50 px-1.5 py-0.5 font-semibold text-caption1 text-red-500">
					수료 위험
				</span>
			)}
			{editable && <ChevronDown className="size-4 shrink-0 text-label-assistive" />}
		</>
	);

	if (!editable) {
		return (
			<div ref={ref as React.Ref<HTMLDivElement>} className="flex items-center gap-1.5">
				{content}
			</div>
		);
	}

	return (
		<button
			ref={ref as React.Ref<HTMLButtonElement>}
			type="button"
			className="flex cursor-pointer items-center gap-1.5 rounded-lg px-1 py-1 hover:bg-background-strong"
			onClick={onClick}
			{...props}
		>
			{content}
		</button>
	);
});
MemberActivityStatus.displayName = 'MemberActivityStatus';
