import { bill } from '@dpm-core/api';
import { queryOptions } from '@tanstack/react-query';

export const getBiilsQueryOptions = queryOptions({
	queryKey: ['bills'],
	queryFn: bill.getBiils,
});
