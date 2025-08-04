'use client';

import { Button, Form, useAppShell } from '@dpm-core/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useId } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { LoadingBox } from '@/components/loading-box';
import { getBillDetailByIdQueryOptions } from '@/remotes/queries/bill';

const BillDetailContainer = ({ billId }: { billId: number }) => {
	const { data } = useSuspenseQuery(getBillDetailByIdQueryOptions(billId));
	const formId = useId();
	const form = useForm({
		resolver: zodResolver(
			z.object({
				name: z.string().min(1),
			}),
		),
	});
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(console.log)} id={formId}>
				BillDetail
			</form>
			<BillDetailSubmitButton formId={formId} />
		</Form>
	);
};

const BillDetailSubmitButton = ({ formId }: { formId: string }) => {
	const { ref } = useAppShell();
	return createPortal(
		<Button
			className="fixed bottom-0 w-full mx-auto"
			variant="secondary"
			size="full"
			style={{
				maxWidth: ref.current.clientWidth,
			}}
			form={formId}
		>
			참석여부 제출하기
		</Button>,
		ref.current,
	);
};

const BillDetail = ErrorBoundary.with({ fallback: <></> }, (props: { billId: number }) => (
	<Suspense fallback={<LoadingBox />}>
		<BillDetailContainer billId={props.billId} />
	</Suspense>
));

export { BillDetail };
