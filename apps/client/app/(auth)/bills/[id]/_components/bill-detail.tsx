'use client';

import { Suspense, useId } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Form, Input } from '@dpm-core/shared';

import { LoadingBox } from '@/components/loading-box';
import { getBillDetailByIdQueryOptions } from '@/remotes/queries/bill';

import { BillDetailSubmitButton } from './bill-detail-submit-button';
import { BillOpenDetail } from './bill-open-detail';

const BillCompletedDetail = () => {
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

const BillInProgressDetail = () => {
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
			return <BillCompletedDetail />;
		case 'IN_PROGRESS':
			return <BillInProgressDetail />;
		default:
			billDetail.billStatus satisfies never;
	}
}

const BillDetail = (props: { billId: number }) => (
	<ErrorBoundary fallback={<></>}>
		<Suspense fallback={<LoadingBox />}>
			<BillDetailContainer billId={props.billId} />
		</Suspense>
	</ErrorBoundary>
);

export { BillDetail };
