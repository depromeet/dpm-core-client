'use client';

import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { AppHeader } from '@/components/app-header';
import { LoadingBox } from '@/components/loading-box';
import { getGatheringMembersQueryOptions } from '@/remotes/queries/gathering';

interface BillGatheringContainerProps {
	gatheringId: number;
}

export const _BillGatheringContainer = ({ gatheringId }: BillGatheringContainerProps) => {
	const {
		data: { data: gatheringMember },
	} = useSuspenseQuery(getGatheringMembersQueryOptions({ gatheringId }));

	return (
		<>
			<AppHeader title="참석 현황" />
			bill-gathering-container{gatheringId}
		</>
	);
};

export const BillGatheringContainer = ErrorBoundary.with(
	{ fallback: <></> },
	({ gatheringId }: BillGatheringContainerProps) => (
		<Suspense fallback={<LoadingBox />}>
			<_BillGatheringContainer gatheringId={gatheringId} />
		</Suspense>
	),
);
