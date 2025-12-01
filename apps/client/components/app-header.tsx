'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
	leftIcon: leftIconProp,
}: AppHeaderProps) => {
	const router = useRouter();
	const leftIcon = leftIconProp ?? (
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
	);
	return (
		<header
			className={cn('relative mb-5 flex h-12 items-center justify-center px-4 py-3', className)}
		>
			{leftIcon}
			<h3 className="font-semibold text-body1 text-label-strong">{title}</h3>
			{rightIcon}
		</header>
	);
};

export { AppHeader };
