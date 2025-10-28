import { AppLayout } from '@dpm-core/shared';

import { AttendanceMemberDetailContainer } from './_components/attendance-member-detail-container';

interface AttendanceMemberDetailPageProps {
	params: Promise<{ memberId: string }>;
}

export default async function AttendanceMemberDetailPage({
	params,
}: AttendanceMemberDetailPageProps) {
	const { memberId } = await params;

	return (
		<AppLayout className="bg-background-normal">
			<AttendanceMemberDetailContainer memberId={Number(memberId)} />
		</AppLayout>
	);
}
