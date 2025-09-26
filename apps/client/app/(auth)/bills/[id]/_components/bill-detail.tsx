'use client';

import type { Bill } from '@dpm-core/api';
import { Form, Input } from '@dpm-core/shared';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useId } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingBox } from '@/components/loading-box';
import { getBillDetailByIdQueryOptions } from '@/remotes/queries/bill';
import { BillDetailSubmitButton } from './bill-detail-submit-button';
import { BillOpenDetail } from './bill-open-detail';

const BillCompletedDetail = ({ billDetail }: { billDetail: Bill }) => {
	const formId = useId();
	const form = useForm({
		defaultValues: {},
	});
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(console.log)} id={formId}>
				<Input />
			</form>
			<BillDetailSubmitButton formId={formId} />
		</Form>
	);
};

const BillInProgressDetail = ({ billDetail }: { billDetail: Bill }) => {
	const formId = useId();
	const form = useForm({
		defaultValues: {},
	});
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(console.log)} id={formId}>
				<Input />
			</form>
			<BillDetailSubmitButton formId={formId} />
		</Form>
	);
};

function BillDetailContainer({ billId }: { billId: number }) {
	const {
		data: { data: billDetail },
	} = useSuspenseQuery(getBillDetailByIdQueryOptions(billId));
	switch (billDetail.billStatus) {
		case 'OPEN':
			return <BillOpenDetail billDetail={billDetail} />;
		case 'COMPLETED':
			return <BillCompletedDetail billDetail={billDetail} />;
		case 'IN_PROGRESS':
			return <BillInProgressDetail billDetail={billDetail} />;
		default:
			billDetail.billStatus satisfies never;
	}
}

const BillDetail = ErrorBoundary.with({ fallback: <></> }, (props: { billId: number }) => (
	<Suspense fallback={<LoadingBox />}>
		<BillDetailContainer billId={props.billId} />
	</Suspense>
));

export { BillDetail };
