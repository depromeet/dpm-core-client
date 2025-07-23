import { AttendanceSessionDetailContainer } from './_components/attendance-session-detail-container';

interface AttendanceSessionDetailPageProps {
	params: Promise<{ memberId: string; sessionId: string }>;
}

const AttendanceSessionDetailPage = async ({ params }: AttendanceSessionDetailPageProps) => {
	const { memberId, sessionId } = await params;

	return (
		<AttendanceSessionDetailContainer memberId={Number(memberId)} sessionId={Number(sessionId)} />
	);
};

export default AttendanceSessionDetailPage;
