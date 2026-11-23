import { SafeAreaAppLayout } from '@/components/app-layout';
import { BottomTabBar } from '@/components/bottom-tab-bar';
import { NavigationBar } from '@/components/navigation-bar';

import { AttendanceMe } from '../_components/attendance-me';
import { AttendancePolicyButton } from './attendance-policy-button';

export default function AttendanceMePage() {
	return (
		<SafeAreaAppLayout hasBottomTabBar className="h-dvh bg-background-normal">
			<NavigationBar className="justify-end">
				<h1 className="absolute left-1/2 -translate-x-1/2 text-body1 font-semibold">
					내 출석 현황
				</h1>
				<AttendancePolicyButton />
			</NavigationBar>
			<AttendanceMe />
			<BottomTabBar />
		</SafeAreaAppLayout>
	);
}
