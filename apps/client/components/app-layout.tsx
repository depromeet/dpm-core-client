import type { PropsWithChildren } from 'react';
import type { HTMLMotionProps } from 'motion/react';
import { AppLayout, cn } from '@dpm-core/shared';

type AppLayoutProps = HTMLMotionProps<'div'> & { hasBottomTabBar?: boolean };

export const SafeAreaAppLayout = ({
	className,
	hasBottomTabBar = false,
	...props
}: PropsWithChildren<AppLayoutProps>) => {
	return (
		<AppLayout
			className={cn('pt-safe-area', !hasBottomTabBar && 'pb-safe-area', className)}
			{...props}
		/>
	);
};
