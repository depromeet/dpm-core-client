'use client';

import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { useAuth } from '@/providers/auth-provider';

import { AdminAfterPartyDetail } from './_components/admin/admin-after-party-detail';
import { DeeperAfterPartyDetail } from './_components/deeper/deeper-after-party-detail';

export default function AfterPartyDetailPage() {
	const { user } = useAuth();

	return user?.isAdmin ? (
		<SafeAreaAppLayout className="h-dvh bg-background-normal">
			<AppHeader title="회식 상세" className="mb-0" />
			<AdminAfterPartyDetail />
		</SafeAreaAppLayout>
	) : (
		<DeeperAfterPartyDetail />
	);
}
