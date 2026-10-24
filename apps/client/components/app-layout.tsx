import type { PropsWithChildren } from 'react';
import type { HTMLMotionProps } from 'motion/react';
import { AppLayout, cn } from '@dpm-core/shared';

type AppLayoutProps = HTMLMotionProps<'div'> & {
	hasBottomTabBar?: boolean;
	hasBottomSafeArea?: boolean;
};

export const SafeAreaAppLayout = ({
	className,
	hasBottomTabBar = false,
	hasBottomSafeArea = true,
	...props
}: PropsWithChildren<AppLayoutProps>) => {
	return (
		<AppLayout
			className={cn(
				'pt-safe-area',
				!hasBottomTabBar && hasBottomSafeArea && 'pb-safe-area',
				className,
			)}
			{...props}
		/>
	);
};
