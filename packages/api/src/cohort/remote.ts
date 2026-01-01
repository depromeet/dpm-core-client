import { http } from '../http';
import type { Cohort } from './types';

export const cohort = {
	getCurrentCohort: async () => {
		const res = await http.get<{ cohortNumber: Cohort }>('v1/cohort');
		return res;
	},
};
