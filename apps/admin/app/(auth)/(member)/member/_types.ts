import type { MemberStatus, Part } from '@dpm-core/api';

export type { MemberStatus };

export interface MemberListItem {
	id: number;
	name: string;
	teamNumber: number;
	part: Part;
	status: MemberStatus;
	assignmentScore?: number;
}
