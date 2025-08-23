import { type ApiResponse, type Bill, bill, type CreateBillParams } from '@dpm-core/api';
import { type MutationOptions, mutationOptions } from '@tanstack/react-query';

const MUTATE_KEY = 'BILL';

export const createBillMutationOptions = (
	options?: MutationOptions<ApiResponse<Pick<Bill, 'billId'>>, unknown, CreateBillParams, unknown>,
) =>
	mutationOptions({
		mutationKey: [MUTATE_KEY],
		mutationFn: (params: CreateBillParams) => bill.createBill(params),
		...options,
	});

export const closeBillParticipationMutationOptions = (
	options?: MutationOptions<string, unknown, { billId: number }, unknown>,
) =>
	mutationOptions({
		mutationKey: [MUTATE_KEY],
		mutationFn: (params: { billId: number }) => bill.closeBillParticipation(params),
		...options,
	});
