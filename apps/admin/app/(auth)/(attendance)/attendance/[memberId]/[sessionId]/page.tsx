import { AppLayout } from '@dpm-core/shared';

import { AttendanceSessionDetailContainer } from './_components/attendance-session-detail-container';

interface AttendanceSessionDetailPageProps {
	params: Promise<{ memberId: string; sessionId: string }>;
}

const AttendanceSessionDetailPage = async ({ params }: AttendanceSessionDetailPageProps) => {
	const { memberId, sessionId } = await params;

	return (
		<AppLayout className="bg-background-normal">
			<AttendanceSessionDetailContainer memberId={Number(memberId)} sessionId={Number(sessionId)} />
		</AppLayout>
	);
};

export default AttendanceSessionDetailPage;
