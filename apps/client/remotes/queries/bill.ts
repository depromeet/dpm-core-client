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
