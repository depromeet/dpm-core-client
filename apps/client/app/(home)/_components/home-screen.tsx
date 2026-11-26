import type { PropsWithChildren, ReactNode } from 'react';

import { SafeAreaAppLayout } from '@/components/app-layout';
import { BottomTabBar } from '@/components/bottom-tab-bar';

import { HomeHeader } from './home-header';
import { UserActionList } from './user-action-list';

interface HomeScreenProps extends PropsWithChildren {
	beforeHeader?: ReactNode;
	afterTabBar?: ReactNode;
}

export const HomeScreen = ({ beforeHeader, afterTabBar, children }: HomeScreenProps) => (
	<SafeAreaAppLayout hasBottomTabBar className="h-dvh">
		{beforeHeader}
		<HomeHeader />
		<main className="scrollbar-hide flex-1 overflow-auto">
			{children}
			<UserActionList />
		</main>
		<BottomTabBar />
		{afterTabBar}
	</SafeAreaAppLayout>
);
