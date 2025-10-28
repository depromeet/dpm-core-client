import { cn } from '../../utils/cn';

const Divider = ({ className }: { className?: string }) => {
	return <div className={cn('h-[1px] w-full bg-background-strong', className)} />;
};

export { Divider };
