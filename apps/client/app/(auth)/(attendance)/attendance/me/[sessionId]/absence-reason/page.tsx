import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';

import { AbsenceReasonSubmit } from './_components/absence-reason-submit';

interface AttendanceMeBySessionIdAbsenceReasonProps {
	params: Promise<{ sessionId: string }>;
}

export default async function page({ params }: AttendanceMeBySessionIdAbsenceReasonProps) {
	const { sessionId } = await params;

	return (
		<SafeAreaAppLayout className="bg-background-normal">
			<AppHeader title="" className="mb-0" />
			<AbsenceReasonSubmit sessionId={Number(sessionId)} />
		</SafeAreaAppLayout>
	);
}
