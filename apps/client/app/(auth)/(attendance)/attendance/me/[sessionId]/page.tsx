import { AppLayout } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { AttendanceSessionDetail } from './_components/attendance-session-detail';

interface AttendanceMeBySessionIdProps {
	params: Promise<{ sessionId: string }>;
}

export default async function page({ params }: AttendanceMeBySessionIdProps) {
	const { sessionId } = await params;

	return (
		<AppLayout className="bg-gray-0">
			<AppHeader title="내 출석 상세" />
			<AttendanceSessionDetail sessionId={Number(sessionId)} />
		</AppLayout>
	);
}
