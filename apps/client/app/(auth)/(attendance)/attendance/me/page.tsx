import Link from 'next/link';
import { ChevronRight } from '@dpm-core/shared';

import { SafeAreaAppLayout } from '@/components/app-layout';
import { BottomTabBar } from '@/components/bottom-tab-bar';
import { NavigationBar } from '@/components/navigation-bar';

import { AttendanceMe } from '../_components/attendance-me';

export default function AttendanceMePage() {
	return (
		<SafeAreaAppLayout hasBottomTabBar className="h-dvh bg-background-normal">
			<NavigationBar className="justify-end">
				<h1 className="-translate-x-1/2 absolute left-1/2 font-semibold text-body1">
					내 출석 현황
				</h1>
				<div className="flex items-center gap-1">
					<Link href="/attendance/policy" className="font-medium text-caption1 text-label-tertiary">
						규정
					</Link>
					<ChevronRight className="size-3 text-icon-noraml" />
				</div>
			</NavigationBar>
			<AttendanceMe />
			<BottomTabBar />
		</SafeAreaAppLayout>
	);
}
