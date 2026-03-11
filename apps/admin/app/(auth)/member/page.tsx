import { AppLayout } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { MemberList } from './_components/MemberList';

export default function MemberPage() {
	return (
		<AppLayout className="flex flex-col bg-background-normal">
			<AppHeader title="멤버 관리" />
			<MemberList />
		</AppLayout>
	);
}
