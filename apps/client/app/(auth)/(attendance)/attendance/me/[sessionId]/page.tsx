import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';

import { AttendanceSessionDetail } from './_components/attendance-session-detail';

interface AttendanceMeBySessionIdProps {
	params: Promise<{ sessionId: string }>;
}

export default async function page({ params }: AttendanceMeBySessionIdProps) {
	const { sessionId } = await params;

	return (
		<SafeAreaAppLayout className="bg-background-normal">
			<AppHeader title="내 출석 상세" />
			<AttendanceSessionDetail sessionId={Number(sessionId)} />
		</SafeAreaAppLayout>
	);
}
