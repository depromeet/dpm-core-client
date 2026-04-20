import { queryOptions } from '@tanstack/react-query';
import { cohort } from '@dpm-core/api';

export const COHORT_LIST_QUERY_KEY = ['cohort-list'] as const;

export const getCohortListQuery = queryOptions({
	queryKey: COHORT_LIST_QUERY_KEY,
	queryFn: () => cohort.getList(),
});

export const getCohortLatestQuery = queryOptions({
	queryKey: ['cohort-latest'],
	queryFn: () => cohort.getLatest(),
});
