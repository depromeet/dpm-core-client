import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

const NavigationBar = (props: ComponentPropsWithoutRef<'header'>) => {
	return (
		<header
			{...props}
			className={cn(
				'h-12 sticky top-0 py-2 px-4 flex items-center justify-between',
				props.className,
			)}
		/>
	);
};

export { NavigationBar };
