import { cn } from '../../utils/cn';

const Divider = ({ className }: { className?: string }) => {
	return <div className={cn('h-px w-full bg-background-strong', className)} />;
};

export { Divider };
