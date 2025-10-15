'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, cn } from '@dpm-core/shared';

interface AppHeaderProps {
	title: string;
	backHref?: string;
	className?: string;
}

const AppHeader = ({ title, backHref, className }: AppHeaderProps) => {
	const router = useRouter();
	return (
		<div className={cn('relative mb-5 flex h-12 items-center justify-center px-4 py-3', className)}>
			<Link
				href={backHref ?? '#'}
				onClick={(event) => {
					if (backHref) return;
					event.preventDefault();
					router.back();
				}}
				className="absolute left-4"
			>
				<ChevronLeft />
			</Link>
			<h3 className="font-semibold text-body1 text-label-strong">{title}</h3>
		</div>
	);
};

export { AppHeader };
