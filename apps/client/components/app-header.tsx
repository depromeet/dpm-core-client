'use client';

import { ChevronLeft, cn } from '@dpm-core/shared';
import Link from 'next/link';

interface AppHeaderProps {
	title: string;
	backHref?: string;
	className?: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

const AppHeader = ({
	title,
	backHref,
	className,
	rightIcon = <></>,
	leftIcon = (
		<Link
			href={backHref ?? '-1'}
			onClick={(event) => {
				if (backHref) return;
				event.preventDefault();
			}}
			className="absolute left-4"
		>
			<ChevronLeft />
		</Link>
	),
}: AppHeaderProps) => {
	return (
		<div className={cn('h-12 flex items-center justify-center relative px-4 py-3 mb-5', className)}>
			{leftIcon}
			<h3 className="text-body1 font-semibold text-label-strong">{title}</h3>
			{rightIcon}
		</div>
	);
};

export { AppHeader };
