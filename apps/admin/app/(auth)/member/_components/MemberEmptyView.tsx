import { Asterisk } from 'lucide-react';
import { cn } from '@dpm-core/shared';

interface MemberEmptyViewProps {
	className?: string;
	message?: string;
}

export const MemberEmptyView = ({
	className,
	message = '조건에 맞는 멤버를 찾을 수 없어요',
}: MemberEmptyViewProps) => {
	return (
		<div className={cn('flex w-full flex-col items-center justify-center gap-4 py-30', className)}>
			<Asterisk className="size-14 text-label-assistive" strokeWidth={1.5} />
			<p className="font-medium text-body1 text-label-assistive">{message}</p>
		</div>
	);
};
