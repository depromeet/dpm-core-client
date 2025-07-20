import type { HTMLMotionProps } from 'motion/react';
import * as motion from 'motion/react-client';
import type { PropsWithChildren } from 'react';
import { cn } from '../utils/cn';

type AppLayoutProps = HTMLMotionProps<'div'>;

const AppLayout = ({ className, ...props }: PropsWithChildren<AppLayoutProps>) => {
	return (
		<motion.div
			className={cn('w-full flex flex-col min-h-[inherit] bg-background-subtle', className)}
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
