'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@dpm-core/shared';

const NavigationBar = (props: ComponentPropsWithoutRef<'header'>) => {
	return (
		<header
			{...props}
			className={cn(
				'sticky top-0 min-h-12 w-full bg-background-normal transition-transform duration-300 ease-in-out',
				props.className,
			)}
		>
			<div className="mx-auto w-full max-w-[1200px]">{props.children}</div>
		</header>
	);
};

export { NavigationBar };
