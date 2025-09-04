import { bill } from '@dpm-core/api';
import { queryOptions } from '@tanstack/react-query';

export const getBillsQueryOptions = queryOptions({
	queryKey: ['bills'],
	queryFn: bill.getBiils,
});

export const getBillDetailByIdQueryOptions = (id: number) =>
	queryOptions({
		queryKey: ['bill', id],
		queryFn: () => bill.getBillDetailById(id),
	});

export const getBillSubmittedMemberByIdQueryOptions = (id: number) =>
	queryOptions({
		queryKey: ['bills', id, 'submitted-member'],
		queryFn: () => bill.getBillSubmittedMembersById(id),
	});

export const getBillFinalAmountMemberByIdQueryOptions = (id: number) =>
	queryOptions({
		queryKey: ['bills', id, 'members'],
		queryFn: () => bill.getBillFinalAmountByMember(id),
	});

export const getBillAccountbyId = (accountId: number) =>
	queryOptions({
		queryKey: ['bills', 'account', accountId],
		queryFn: () => bill.getBillAccountById(accountId),
	});
