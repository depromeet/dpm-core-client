import Link from 'next/link';
import { AppLayout, Button, ChevronLeft } from '@dpm-core/shared';

import { NavigationBar } from '@/components/navigation-bar';

import { AttendanceMe } from '../_components/attendance-me';

export default function AttendanceMePage() {
	return (
		<AppLayout className="bg-gray-0">
			<NavigationBar>
				<Link href="/">
					<ChevronLeft />
				</Link>
				<h1 className="-translate-x-1/2 absolute left-1/2 font-semibold text-body1">
					내 출석 현황
				</h1>
				<Button
					asChild
					variant="none"
					size="sm"
					className="rounded-[100px] border border-line-normal bg-background-normal text-label-subtle"
				>
					<Link href="/attendance/policy">규정</Link>
				</Button>
			</NavigationBar>
			<AttendanceMe />
		</AppLayout>
	);
}
