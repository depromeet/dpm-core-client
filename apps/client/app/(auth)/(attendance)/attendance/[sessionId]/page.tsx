import { ChevronLeft } from '@dpm-core/shared';
import Link from 'next/link';
import { KeyboardAwareViewport } from '@/components/keyboard-aware-viewport';
import { NavigationBar } from '@/components/navigation-bar';
import { AttendanceForm } from '../_components/attendance-form';

interface Props {
	params: Promise<{ sessionId: string }>;
}

export default async function page({ params }: Props) {
	const { sessionId } = await params;

	return (
		<KeyboardAwareViewport className="flex flex-col h-dvh">
			<NavigationBar>
				<Link href="/">
					<ChevronLeft />
				</Link>
			</NavigationBar>
			<AttendanceForm sessionId={Number(sessionId)} />
		</KeyboardAwareViewport>
	);
}
