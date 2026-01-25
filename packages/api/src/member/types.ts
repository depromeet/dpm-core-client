import type { Cohort } from '../cohort';

export type Part = 'WEB' | 'ANDROID' | 'IOS' | 'DESIGN' | 'SERVER' | 'ETC';

export type MemberStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN';

export interface Member {
	email: string;
	name: string;
	cohort: Cohort;
	part: Part;
	teamNumber: number;
	isAdmin: boolean;
	status: MemberStatus;
}
