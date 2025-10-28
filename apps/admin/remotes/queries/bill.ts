import { queryOptions } from '@tanstack/react-query';
import { bill } from '@dpm-core/api';

export const getBiilsQueryOptions = queryOptions({
	queryKey: ['bills'],
	queryFn: bill.getBiils,
});
