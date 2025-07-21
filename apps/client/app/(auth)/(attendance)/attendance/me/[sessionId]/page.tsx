import { Fragment } from 'react';
import { AppHeader } from '@/components/app-header';
import { AttendanceSessionDetail } from './_components/attendance-session-detail';

interface AttendanceMeBySessionIdProps {
	params: Promise<{ sessionId: string }>;
}

export default async function page({ params }: AttendanceMeBySessionIdProps) {
	const { sessionId } = await params;

	return (
		<Fragment>
			<AppHeader title="내 출석 상세" backHref="/attendance/me" />
			<AttendanceSessionDetail sessionId={Number(sessionId)} />
		</Fragment>
	);
}
