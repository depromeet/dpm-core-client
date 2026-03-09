import { AppLayout } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

export default function MemberPage() {
	return (
		<AppLayout className="flex flex-col bg-background-normal">
			<AppHeader title="멤버 관리" />
			<div className="flex flex-1 items-center justify-center px-10 py-8">
				<p className="text-body1 text-label-alternative">멤버관리 페이지입니다.</p>
			</div>
		</AppLayout>
	);
}
