'use client';

import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBox } from '@/components/error-box';
import { LoadingBox } from '@/components/loading-box';
import { getBillsQueryOptions } from '@/remotes/queries/bill';
import { useBillStatusSearchParams } from '../_hooks/use-bill-status-search-params';
import { BillItem } from './bill-item';

const BillListContainer = () => {
	const { billStatus } = useBillStatusSearchParams();
	const {
		data: {
			data: { bills },
		},
	} = useSuspenseQuery(getBillsQueryOptions);

	const filteredBillsByStatus =
		billStatus === 'ALL' ? bills : bills.filter((bill) => bill.billStatus === billStatus);

	return (
		<ul className="flex flex-col gap-y-2">
			{filteredBillsByStatus.map((bill) => {
				return <BillItem key={bill.billId} bill={bill} />;
			})}
		</ul>
	);
};

const BillLsit = ErrorBoundary.with(
	{
		fallback: (props) => <ErrorBox onReset={() => props.reset()} />,
	},
	() => (
		<Suspense fallback={<LoadingBox />}>
			<BillListContainer />
		</Suspense>
	),
);

export { BillLsit };
