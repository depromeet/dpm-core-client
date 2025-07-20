'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export interface CheckIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface CheckIconProps extends HTMLAttributes<HTMLDivElement> {
	size?: number;
}

const pathVariants: Variants = {
	normal: {
		opacity: 1,
		pathLength: 1,
		scale: 1,
		transition: {
			duration: 0.3,
			opacity: { duration: 0.1 },
		},
	},
	animate: {
		opacity: [0, 1],
		pathLength: [0, 1],
		scale: [0.5, 1],
		transition: {
			duration: 0.4,
			opacity: { duration: 0.1 },
		},
	},
};

const CheckIcon = forwardRef<CheckIconHandle, CheckIconProps>(
	({ className, size = 28, ...props }, ref) => {
		const controls = useAnimation();

		useEffect(() => {
			controls.start('animate');
		}, [controls]);

		return (
			<div className={cn(className)} {...props}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<title>Check</title>
					<motion.path
						variants={pathVariants}
						initial="normal"
						animate={controls}
						d="M4 12 9 17L20 6"
					/>
				</svg>
			</div>
		);
	},
);

CheckIcon.displayName = 'CheckIcon';

export { CheckIcon };
