import { queryOptions } from '@tanstack/react-query';
import { cohort } from '@dpm-core/api';

export const COHORT_LIST_QUERY_KEY = ['cohort-list'] as const;

export const getCohortListQuery = queryOptions({
	queryKey: COHORT_LIST_QUERY_KEY,
	queryFn: () => cohort.getList(),
});

/** GET /v1/cohort - 현재 기수 번호 */
export const getCurrentCohortQuery = queryOptions({
	queryKey: ['cohort-current'],
	queryFn: () => cohort.getCurrentCohort(),
	select: (data) => data.data.cohortNumber,
	staleTime: 5 * 60 * 1000,
});

export const getCohortLatestQuery = queryOptions({
	queryKey: ['cohort-latest'],
	queryFn: () => cohort.getLatest(),
});

/** GET /v3/cohorts/current/teams - 현재 기수 팀 선택지 */
export const getCurrentCohortTeamsQuery = queryOptions({
	queryKey: ['cohort-current-teams'],
	queryFn: () => cohort.getCurrentCohortTeams(),
	select: (data) => data.data.teams,
	staleTime: 5 * 60 * 1000,
});
