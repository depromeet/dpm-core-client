'use client';

import { type ReactNode, useEffect, useRef } from 'react';

import { SafeAreaAppLayout } from '@/components/app-layout';

interface FeedbackVirtualViewportProps {
	children: ReactNode;
	enabled: boolean;
	hasBottomSafeArea: boolean;
}

export const FeedbackVirtualViewport = ({
	children,
	enabled,
	hasBottomSafeArea,
}: FeedbackVirtualViewportProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const viewport = window.visualViewport;
		const container = containerRef.current;
		if (!enabled || !viewport || !container) return;

		const syncHeight = () => {
			const focused = document.activeElement;
			const isEditing = focused instanceof HTMLTextAreaElement && container.contains(focused);
			if (isEditing && viewport.scale === 1 && viewport.height < window.innerHeight - 120) {
				container.style.height = `${viewport.height}px`;
			} else {
				container.style.removeProperty('height');
			}
		};

		viewport.addEventListener('resize', syncHeight);
		window.addEventListener('resize', syncHeight);
		container.addEventListener('focusin', syncHeight);
		container.addEventListener('focusout', syncHeight);
		syncHeight();

		return () => {
			viewport.removeEventListener('resize', syncHeight);
			window.removeEventListener('resize', syncHeight);
			container.removeEventListener('focusin', syncHeight);
			container.removeEventListener('focusout', syncHeight);
			container.style.removeProperty('height');
		};
	}, [enabled]);

	return (
		<SafeAreaAppLayout
			ref={containerRef}
			hasBottomSafeArea={hasBottomSafeArea}
			className="h-dvh bg-background-normal"
		>
			{children}
		</SafeAreaAppLayout>
	);
};
