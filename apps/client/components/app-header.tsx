import { ChevronLeft, cn } from '@dpm-core/shared';
import Link from 'next/link';

interface AppHeaderProps {
	title: string;
	backHref: string;
	className?: string;
}

const AppHeader = ({ title, backHref = '/', className }: AppHeaderProps) => {
	return (
		<div className={cn('h-12 flex items-center justify-center relative px-4 py-3 mb-5', className)}>
			<Link href={backHref} className="absolute left-4">
				<ChevronLeft />
			</Link>
			<h3 className="text-body1 font-semibold text-label-strong">{title}</h3>
		</div>
	);
};

export { AppHeader };
