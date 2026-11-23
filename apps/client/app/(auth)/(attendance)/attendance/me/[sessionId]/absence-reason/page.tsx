import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';

import { AttendancePolicyButton } from '../../attendance-policy-button';
import { AbsenceReasonSubmit } from './_components/absence-reason-submit';

interface AttendanceMeBySessionIdAbsenceReasonProps {
	params: Promise<{ sessionId: string }>;
}

export default async function page({ params }: AttendanceMeBySessionIdAbsenceReasonProps) {
	const { sessionId } = await params;

	return (
		<SafeAreaAppLayout className="bg-background-normal">
			<AppHeader title="" className="mb-0 justify-end" rightIcon={<AttendancePolicyButton />} />
			<AbsenceReasonSubmit sessionId={Number(sessionId)} />
		</SafeAreaAppLayout>
	);
}
