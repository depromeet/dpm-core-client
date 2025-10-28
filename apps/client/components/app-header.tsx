'use client';

import Link from 'next/link';
import { ChevronLeft, cn } from '@dpm-core/shared';

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
		<div className={cn('relative mb-5 flex h-12 items-center justify-center px-4 py-3', className)}>
			{leftIcon}
			<h3 className="font-semibold text-body1 text-label-strong">{title}</h3>
			{rightIcon}
		</div>
	);
};

export { AppHeader };
