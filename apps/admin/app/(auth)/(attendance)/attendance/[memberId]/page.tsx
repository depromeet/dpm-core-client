import { AttendanceMemberDetailContainer } from './_components/attendance-member-detail-container';

interface AttendanceMemberDetailPageProps {
	params: Promise<{ memberId: string }>;
}

export default async function AttendanceMemberDetailPage({
	params,
}: AttendanceMemberDetailPageProps) {
	const { memberId } = await params;

	return <AttendanceMemberDetailContainer memberId={Number(memberId)} />;
}
