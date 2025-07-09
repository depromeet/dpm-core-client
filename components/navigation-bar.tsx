'use client';

import { cn } from '@/lib/utils';
import { useIsomorphicLayoutEffect } from 'motion/react';
import { type ComponentPropsWithoutRef, useCallback, useRef, useState } from 'react';

const NavigationBar = (props: ComponentPropsWithoutRef<'header'>) => {
	const [isHidden, setIsHidden] = useState(false);
	const prevScrollY = useRef(0);

	const handleScroll = useCallback(() => {
		const currentScrollY = window.scrollY;
		const scrollDiff = Math.abs(currentScrollY - prevScrollY.current);

		if (scrollDiff > 50) {
			if (currentScrollY > prevScrollY.current) {
				setIsHidden(true);
			} else {
				setIsHidden(false);
			}
			prevScrollY.current = currentScrollY;
		}
	}, []);

	useIsomorphicLayoutEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [handleScroll]);

	return (
		<header
			{...props}
			className={cn(
				'h-12 sticky top-0 py-2 px-4 flex items-center justify-between bg-white transition-transform duration-300 ease-in-out',
				isHidden && '-translate-y-full',
				props.className,
			)}
		/>
	);
};

export { NavigationBar };
