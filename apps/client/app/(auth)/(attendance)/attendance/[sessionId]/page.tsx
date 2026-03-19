import Link from 'next/link';
import { ChevronLeft } from '@dpm-core/shared';

import { SafeAreaAppLayout } from '@/components/app-layout';
import { NavigationBar } from '@/components/navigation-bar';

import { AttendanceForm } from '../_components/attendance-form';

interface Props {
	params: Promise<{ sessionId: string }>;
}

export default async function page({ params }: Props) {
	const { sessionId } = await params;

	return (
		<SafeAreaAppLayout className="relative flex h-dvh flex-col bg-background-normal">
			<NavigationBar>
				<Link href="/">
					<ChevronLeft />
				</Link>
			</NavigationBar>
			<AttendanceForm sessionId={Number(sessionId)} />
		</SafeAreaAppLayout>
	);
}
