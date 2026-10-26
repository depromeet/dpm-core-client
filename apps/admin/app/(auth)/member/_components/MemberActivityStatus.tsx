import type { MemberActivityStatus as ActivityStatus } from '@dpm-core/api';
import { cn } from '@dpm-core/shared';

interface MemberActivityStatusProps {
	status: ActivityStatus;
}

const DOT_COLOR: Record<ActivityStatus, string> = {
	NORMAL: 'bg-green-500',
	AT_RISK: 'bg-green-500',
	INACTIVE: 'bg-label-assistive',
};

/**
 * 활동 상태 셀. 읽기 전용이다.
 * 수료 위험은 "활동 중" 옆에 별도 배지로 붙는다 (서버가 계산하는 값이라 직접 고를 수 없다).
 */
export const MemberActivityStatus = ({ status }: MemberActivityStatusProps) => (
	<div className="flex items-center gap-1.5">
		<span className={cn('size-2 shrink-0 rounded-full', DOT_COLOR[status])} />
		<span className="font-semibold text-body2 text-label-normal">
			{status === 'INACTIVE' ? '활동 정지' : '활동 중'}
		</span>
		{status === 'AT_RISK' && (
			<span className="rounded-md bg-red-50 px-1.5 py-0.5 font-semibold text-caption1 text-red-500">
				수료 위험
			</span>
		)}
	</div>
);
