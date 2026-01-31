import { cn } from '../utils/cn';
import { SubmitCompleted, SubmitLate, SubmitNotSubmitted, SubmitPending } from './icons';

export type SubmitStatus = 'pending' | 'completed' | 'late' | 'not-submitted';

interface AssignmentSubmitStatusProps {
	status: SubmitStatus;
	className?: string;
}

const statusConfig: Record<
	SubmitStatus,
	{
		icon: React.ComponentType<{ className?: string }>;
		label: string;
	}
> = {
	pending: {
		icon: SubmitPending,
		label: '확인 전',
	},
	completed: {
		icon: SubmitCompleted,
		label: '제출 완료',
	},
	late: {
		icon: SubmitLate,
		label: '지각 제출',
	},
	'not-submitted': {
		icon: SubmitNotSubmitted,
		label: '미제출',
	},
};

export const AssignmentSubmitStatus = ({ status, className }: AssignmentSubmitStatusProps) => {
	const config = statusConfig[status];
	const Icon = config.icon;

	return (
		<div className={cn('flex items-center gap-1', className)}>
			<Icon className="size-5 shrink-0" />
			<span className="font-semibold text-body2 text-label-subtle">{config.label}</span>
		</div>
	);
};
