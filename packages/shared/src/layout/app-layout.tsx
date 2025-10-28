import type { PropsWithChildren } from 'react';
import type { HTMLMotionProps } from 'motion/react';
import * as motion from 'motion/react-client';

import { cn } from '../utils/cn';

type AppLayoutProps = HTMLMotionProps<'div'>;

const AppLayout = ({ className, ...props }: PropsWithChildren<AppLayoutProps>) => {
	return (
		<motion.div
			className={cn('flex min-h-[inherit] w-full flex-col bg-background-subtle', className)}
			initial="initial"
			animate="animate"
			transition={{
				staggerChildren: 0.2,
			}}
			{...props}
		/>
	);
};

export { AppLayout };
