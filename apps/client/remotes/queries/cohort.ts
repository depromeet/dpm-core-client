import { queryOptions } from '@tanstack/react-query';
import { cohort } from '@dpm-core/api';

export const getCurrentCohortQueryOptions = () =>
	queryOptions({
		queryKey: ['cohort'],
		queryFn: () => cohort.getCurrentCohort(),
		retry: false,
		refetchInterval: false,
	});
