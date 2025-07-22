'use client';

import { cn } from '@dpm-core/shared';
import type { ComponentPropsWithoutRef } from 'react';

const NavigationBar = (props: ComponentPropsWithoutRef<'header'>) => {
	return (
		<header
			{...props}
			className={cn(
				'min-h-12 sticky top-0 transition-transform duration-300 ease-in-out',
				props.className,
			)}
		/>
	);
};

export { NavigationBar };
