import { Suspense } from 'react';

import { LoadingBox } from '@/components/loading-box';

import { AfterPartyUpdateForm } from './_components/after-party-update-form';

const AfterPartyUpdatePage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	return (
		<Suspense fallback={<LoadingBox />}>
			<AfterPartyUpdateForm gatheringId={Number(id)} />
		</Suspense>
	);
};

export default AfterPartyUpdatePage;
