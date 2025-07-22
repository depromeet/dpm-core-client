'use client';

import { cn } from '@dpm-core/shared';
import {
	type ComponentPropsWithoutRef,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';

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

	useLayoutEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [handleScroll]);

	return (
		<header
			{...props}
			className={cn(
				'min-h-12 sticky top-0 transition-transform duration-300 ease-in-out',
				isHidden && '-translate-y-[40px]',
				props.className,
			)}
		/>
	);
};

export { NavigationBar };
