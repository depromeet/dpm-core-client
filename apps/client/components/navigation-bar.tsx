'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@dpm-core/shared';

const NavigationBar = (props: ComponentPropsWithoutRef<'header'>) => {
	return (
		<header
			{...props}
			className={cn(
				'sticky top-0 flex h-12 items-center justify-between bg-white px-4 py-2 transition-transform duration-300 ease-in-out',
				props.className,
			)}
		/>
	);
};

export { NavigationBar };
