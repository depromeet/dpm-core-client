'use client';

import { Form } from '@dpm-core/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import z from 'zod';
import Devider from '@/components/settle/layout/Devider';
import { createBillMutationOptions } from '@/remotes/mutations/bill';
import { BillCreateButton } from './bill-create-button';
import { InformationFormItem } from './information-form-item';
import { StepFormItem } from './step-form-item';

const createSettleSchema = z.object({
	title: z.string().min(1, '필수 입력 값입니다.'),
	description: z.string().optional(),
	heldAt: z.date(),
	billAccountId: z.number(),
	invitedAuthorityIds: z.array(z.number()),
	gatherings: z
		.array(
			z.object({
				title: z.string().min(1, '필수 입력 값입니다.'),
				receipt: z.object({
					amount: z
						.string()
						.min(1, '필수 입력 값입니다.')
						.regex(/^0$|^[1-9]\d{0,2}(,\d{3})*$/, '올바른 금액 형식이어야 합니다.'),
				}),
			}),
		)
		.min(1, '최소 하나의 차수 정보가 필요합니다.'),
});

const parseFormattedAmount = (amount: string) => {
	return Number(amount.replace(/,/g, ''));
};

type CreateSettleSchema = z.infer<typeof createSettleSchema>;

const FORM_ID = 'create-settle-form';

export const BillForm = () => {
	const router = useRouter();
	const form = useForm<CreateSettleSchema>({
		resolver: zodResolver(createSettleSchema),
		defaultValues: {
			title: '',
			heldAt: new Date(),
			description: '',
			billAccountId: 1,
			invitedAuthorityIds: [1, 2],
			gatherings: [{ title: '', receipt: { amount: '' } }],
		},
	});

	const { mutate: createBillMutate, isPending } = useMutation(
		createBillMutationOptions({
			onSuccess: (response) => {
				router.replace(`settle/create/${response.data.billId}`);
			},
			onError: () => {
				console.log('에러');
			},
		}),
	);

	const handleSubmitSettle = (formData: CreateSettleSchema) => {
		const { title, description, heldAt, gatherings, billAccountId, invitedAuthorityIds } = formData;
		const params = {
			title,
			description,
			billAccountId,
			invitedAuthorityIds,
			gatherings: gatherings.map((gathering, index) => ({
				...gathering,
				heldAt: heldAt.toISOString(),
				roundNumber: index + 1,
				receipt: { amount: parseFormattedAmount(gathering.receipt.amount) },
			})),
		};

		createBillMutate(params);
	};

	const isDisabled = !form.formState.isValid || form.formState.isSubmitting || isPending;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmitSettle)} id={FORM_ID} className="pb-14">
				<InformationFormItem />
				<Devider />
				<StepFormItem />
				<BillCreateButton isLoading={isPending} disabled={isDisabled} form={FORM_ID} />
			</form>
		</Form>
	);
};
