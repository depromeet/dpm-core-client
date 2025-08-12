'use client';

import type { BillStatus } from '@dpm-core/api';
import { Button } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { AppHeader } from '@/components/app-header';
import { LoadingBox } from '@/components/loading-box';
import { getBillDetailByIdQueryOptions } from '@/remotes/queries/bill';
import { BillInformation } from './bill-information';
import { BillStatusInformation } from './bill-status';
import { GatheringList } from './gathering-list';

const _BillDetailContainer = ({ billId }: { billId: number }) => {
	const {
		data: { data: bill },
	} = useSuspenseQuery(getBillDetailByIdQueryOptions(billId));

	return (
		<>
			<BillHeader billStatus={bill.billStatus} />
			<section className="flex flex-col gap-8 p-4">
				<BillStatusInformation billStatus={bill.billStatus} />
				<BillInformation bill={bill} />
			</section>
			<div className="my-2 h-2 bg-gray-100 w-full" />
			<section className="flex flex-col flex-1">
				<GatheringList
					invitationSubmittedCount={bill.invitationSubmittedCount}
					gatherings={bill.gatherings}
				/>
			</section>
			<BillFooterAction billStatus={bill.billStatus} />
		</>
	);
};

export const BillDetailContainer = ErrorBoundary.with(
	{ fallback: <></> },
	(props: { billId: number }) => (
		<Suspense fallback={<LoadingBox />}>
			<_BillDetailContainer billId={props.billId} />
		</Suspense>
	),
);

const billHeaderTitle = (billStatus: BillStatus) => {
	switch (billStatus) {
		case 'OPEN':
			return '정산서';
		case 'IN_PROGRESS':
			return '최종 정산';
		case 'COMPLETED':
			return '최종 정산서';
	}
};

const BillHeader = ({ billStatus }: { billStatus: BillStatus }) => {
	return <AppHeader className="sticky top-0 bg-gray-0 mb-0" title={billHeaderTitle(billStatus)} />;
};

const BillFooterAction = ({ billStatus }: { billStatus: BillStatus }) => {
	if (billStatus === 'COMPLETED') return null;

	return (
		<footer>
			<Button size="full" variant="secondary">
				{billStatus === 'OPEN' ? '멤버 확정하기' : '정산 종료하기'}
			</Button>
		</footer>
	);
};
