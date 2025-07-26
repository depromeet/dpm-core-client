import { ChevronLeft } from '@dpm-core/shared';
import Link from 'next/link';
import { NavigationBar } from '@/components/navigation-bar';
import { AttendanceForm } from '../_components/attendance-form';

interface Props {
	params: Promise<{ sessionId: string }>;
}

export default async function page({ params }: Props) {
	const { sessionId } = await params;

	return (
		<div className="flex flex-col h-dvh">
			<NavigationBar>
				<Link href="/">
					<ChevronLeft />
				</Link>
				<h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-body1">출석</h1>
			</NavigationBar>
			<AttendanceForm sessionId={Number(sessionId)} />
		</div>
	);
}
