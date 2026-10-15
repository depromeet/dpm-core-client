import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';

import { AbsenceReasonSubmit } from './_components/absence-reason-submit';

interface AttendanceMeBySessionIdAbsenceReasonProps {
	params: Promise<{ sessionId: string }>;
}

const EMPTY_TITLE = '';

export default async function page({ params }: AttendanceMeBySessionIdAbsenceReasonProps) {
	const { sessionId } = await params;

	return (
		<SafeAreaAppLayout className="bg-background-normal">
			<AppHeader title={EMPTY_TITLE} />
			<AbsenceReasonSubmit sessionId={Number(sessionId)} />
		</SafeAreaAppLayout>
	);
}
