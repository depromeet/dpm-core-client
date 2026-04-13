'use client';

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@dpm-core/shared';

export const ScrollToTop = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setVisible(window.scrollY > 300);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<button
			type="button"
			onClick={scrollToTop}
			className={cn(
				'fixed right-8 bottom-8 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary-normal text-white shadow-lg transition-all hover:bg-primary-strong',
				visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
			)}
			aria-label="맨 위로 스크롤"
		>
			<ChevronUp className="size-5" />
		</button>
	);
};
