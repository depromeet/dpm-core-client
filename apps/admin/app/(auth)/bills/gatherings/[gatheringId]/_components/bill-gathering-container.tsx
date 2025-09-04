'use client';

import { ErrorBoundary } from '@suspensive/react';
import { Suspense } from 'react';
import { AppHeader } from '@/components/app-header';
import { LoadingBox } from '@/components/loading-box';
import { BillGatheringList } from './bill-gathering-list';

interface BillGatheringContainerProps {
	gatheringId: number;
}

export const _BillGatheringContainer = ({ gatheringId }: BillGatheringContainerProps) => {
	return (
		<>
			<AppHeader title="참석 현황" className="mb-1.5" />
			<BillGatheringList gatheringId={gatheringId} />
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
