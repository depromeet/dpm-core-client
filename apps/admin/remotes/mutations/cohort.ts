import { type MutationOptions, mutationOptions } from '@tanstack/react-query';
import { cohort } from '@dpm-core/api';
import type { CreateCohortRequest, UpdateCohortRequest } from '@dpm-core/api';

export const createCohortMutationOptions = (
	options?: MutationOptions<
		Awaited<ReturnType<typeof cohort.create>>,
		Error,
		CreateCohortRequest
	>,
) =>
	mutationOptions({
		mutationKey: ['cohort', 'create'],
		mutationFn: (params: CreateCohortRequest) => cohort.create(params),
		...options,
	});

export const updateCohortMutationOptions = (
	options?: MutationOptions<
		Awaited<ReturnType<typeof cohort.update>>,
		Error,
		{ cohortId: number; params: UpdateCohortRequest }
	>,
) =>
	mutationOptions({
		mutationKey: ['cohort', 'update'],
		mutationFn: ({ cohortId, params }: { cohortId: number; params: UpdateCohortRequest }) =>
			cohort.update(cohortId, params),
		...options,
	});

export const deleteCohortMutationOptions = (
	options?: MutationOptions<Awaited<ReturnType<typeof cohort.delete>>, Error, number>,
) =>
	mutationOptions({
		mutationKey: ['cohort', 'delete'],
		mutationFn: (cohortId: number) => cohort.delete(cohortId),
		...options,
	});
