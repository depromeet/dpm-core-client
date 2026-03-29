import type { MemberStatus, Part } from '@dpm-core/api';

export type { MemberStatus };

export interface MemberListItem {
	id: number;
	name: string;
	email?: string;
	teamNumber: number;
	part: Part;
	isAdmin: boolean;
	status: MemberStatus;
	assignmentScore?: number;
}
