import z from 'zod';

const cohortSchema = z.coerce.number().int();

export const formatCohort = (cohort: string) => {
	try {
		const parsedCohort = cohortSchema.parse(cohort);
		return `${parsedCohort}`;
	} catch {
		return '';
	}
};
