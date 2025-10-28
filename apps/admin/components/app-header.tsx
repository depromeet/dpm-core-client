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
			className="absolute left-4 md:hidden"
		>
			<ChevronLeft />
		</Link>
	);

	return (
		<header
			className={cn(
				'relative mx-auto mb-5 h-12 w-full max-w-[1200px] bg-background-normal md:mb-0 md:h-auto md:border-line-normal md:border-b',
				className,
			)}
		>
			<div className="flex w-full items-center justify-center px-4 py-3 md:justify-between md:px-10 md:py-6">
				{leftIcon}
				<h3 className="font-semibold text-body1 text-label-strong md:font-bold md:text-headline1">
					{title}
				</h3>
				{rightIcon}
			</div>
		</header>
	);
};

export { AppHeader };
