import { Aesterisk, cn } from '@dpm-core/shared';

interface EmptyViewProps {
	message: string;
}

export const EmptyView = ({ className, message }: React.ComponentProps<'div'> & EmptyViewProps) => {
	return (
		<div className={cn('flex flex-1 flex-col items-center justify-center gap-y-3', className)}>
			<Aesterisk />
			<p className="font-semibold text-body1 text-label-assistive">{message}</p>
		</div>
	);
};
