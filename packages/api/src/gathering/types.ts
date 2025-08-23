import type { Part } from '../member';

export interface GatheringMember {
	name: string;
	authority: string;
	isJoined: boolean;
	teamNumber: number;
	part: Exclude<Part, 'ETC'>;
}
