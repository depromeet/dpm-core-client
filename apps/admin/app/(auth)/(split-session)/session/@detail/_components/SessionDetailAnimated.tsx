'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useIsMobile } from '@dpm-core/shared';

interface SessionDetailAnimatedProps {
	id: string;
	children: React.ReactNode;
}

export const SessionDetailAnimated = (props: SessionDetailAnimatedProps) => {
	const { id, children } = props;

	const isMobile = useIsMobile();

	if (isMobile) {
		return <div className="h-full w-full">{children}</div>;
	}

	return (
		<AnimatePresence mode="wait">
			{id && (
				<motion.div
					className="h-full w-full"
					key={id}
					initial={{ x: '100%', opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: '100%', opacity: 0 }}
					transition={{ duration: 0.5, ease: 'easeInOut' }}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
};
