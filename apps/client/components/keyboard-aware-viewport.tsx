'use client';

import { type ComponentPropsWithoutRef, type PropsWithChildren, useEffect, useRef } from 'react';

interface KeyboardAwareViewportProps extends ComponentPropsWithoutRef<'div'> {}

export const KeyboardAwareViewport = ({
	children,
	...rest
}: PropsWithChildren<KeyboardAwareViewportProps>) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleResize = (event: Event) => {
			if (!ref.current) return;
			const visualViewport = event.target as VisualViewport;
			ref.current.style.height = `${visualViewport.height}px`;
			setTimeout(() => {
				window.scrollTo({
					top: 0,
					behavior: 'smooth',
				});
			});
		};

		visualViewport?.addEventListener('resize', handleResize);
		return () => {
			if (ref.current) {
				ref.current.style.height = 'auto';
			}
			visualViewport?.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div ref={ref} {...rest}>
			{children}
		</div>
	);
};
