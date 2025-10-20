import Link from 'next/link';
import { AppLayout, ChevronLeft } from '@dpm-core/shared';

import { NavigationBar } from '@/components/navigation-bar';

import { AttendanceResult } from './_components/attendance-result-container';
import { FloatingButtonContainer } from './_components/floating-button-container';

interface Props {
	params: Promise<{ sessionId: string }>;
}
const AttendanceCheckResultPage = async ({ params }: Props) => {
	const { sessionId } = await params;

	return (
		<AppLayout className="bg-gray-0">
			<NavigationBar>
				<Link href="/">
					<ChevronLeft />
				</Link>
			</NavigationBar>
			<AttendanceResult sessionId={Number(sessionId)} />
			<FloatingButtonContainer />
		</AppLayout>
	);
};

export default AttendanceCheckResultPage;
