import { cn } from '@dpm-core/shared';

const Divider = ({ className }: { className?: string }) => {
	return <div className={cn('w-full h-[1px] bg-background-strong', className)} />;
};

export { Divider };
