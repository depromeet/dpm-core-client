import { Aesterisk, cn } from '@dpm-core/shared';

interface EmptyViewProps {
	message: string;
}

export const EmptyView = ({ className, message }: React.ComponentProps<'div'> & EmptyViewProps) => {
	return (
		<div className={cn('flex flex-col items-center justify-center gap-y-3 flex-1', className)}>
			<Aesterisk />
			<p className="text-label-assistive text-body1 font-semibold">{message}</p>
		</div>
	);
};
