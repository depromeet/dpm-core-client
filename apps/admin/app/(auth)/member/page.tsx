import { AppLayout } from '@dpm-core/shared';

import { MemberDesktopOnlyGuard } from './_components/MemberDesktopOnlyGuard';
import { MemberManagement } from './_components/MemberManagement';

export default function MemberPage() {
	return (
		<AppLayout className="flex flex-col bg-background-normal">
			<MemberDesktopOnlyGuard>
				<MemberManagement />
			</MemberDesktopOnlyGuard>
		</AppLayout>
	);
}
