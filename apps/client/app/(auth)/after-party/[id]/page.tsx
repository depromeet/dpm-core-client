'use client';

import { AppLayout } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';
import { useAuth } from '@/providers/auth-provider';

import { AdminAfterPartyDetail } from './_components/admin/admin-after-party-detail';
import { DeeperAfterPartyDetail } from './_components/deeper/deeper-after-party-detail';

export default function AfterPartyDetailPage() {
	const { user } = useAuth();

	return !user?.isAdmin ? (
		<AppLayout className="bg-background-normal">
			<AppHeader title="회식 상세" className="mb-0" />
			<AdminAfterPartyDetail />
		</AppLayout>
	) : (
		<DeeperAfterPartyDetail />
	);
}
