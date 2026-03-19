import Link from 'next/link';
import { ChevronLeft } from '@dpm-core/shared';

import { SafeAreaAppLayout } from '@/components/app-layout';
import { NavigationBar } from '@/components/navigation-bar';

import { AttendanceResult } from './_components/attendance-result-container';
import { FloatingButtonContainer } from './_components/floating-button-container';

interface Props {
	params: Promise<{ sessionId: string }>;
}
const AttendanceCheckResultPage = async ({ params }: Props) => {
	const { sessionId } = await params;

	return (
		<SafeAreaAppLayout className="bg-background-normal">
			<NavigationBar>
				<Link href="/">
					<ChevronLeft />
				</Link>
			</NavigationBar>
			<main className="flex-1">
				<AttendanceResult sessionId={Number(sessionId)} />
			</main>
			<FloatingButtonContainer />
		</SafeAreaAppLayout>
	);
};

export default AttendanceCheckResultPage;
