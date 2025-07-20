'use client';

import { ChevronLeft } from '@dpm-core/shared';
import Link from 'next/link';
import { Fragment } from 'react';
import { NavigationBar } from '@/components/navigation-bar';
import { AttendanceSessionDetail } from './_components/attendance-session-detail';

interface AttendanceMeBySessionIdProps {
	params: Promise<{ sessionId: string }>;
}

export default async function page({ params }: AttendanceMeBySessionIdProps) {
	const { sessionId } = await params;

	return (
		<Fragment>
			<NavigationBar>
				<Link href="/attendance/me">
					<ChevronLeft />
				</Link>
				<h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-body1">
					내 출석 상세
				</h1>
			</NavigationBar>
			<AttendanceSessionDetail sessionId={Number(sessionId)} />
		</Fragment>
	);
}
