export type Cohort = string;

export interface CohortItem {
	cohortId: number;
	cohortNumber: string;
}

export interface CohortListResponse {
	cohorts: CohortItem[];
}

export interface CreateCohortRequest {
	value: string;
}

export interface UpdateCohortRequest {
	value: string;
}
