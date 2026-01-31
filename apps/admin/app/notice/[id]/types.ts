import type { SubmitStatus } from '@dpm-core/shared';

export interface Member {
	id: string;
	name: string;
	team: string;
	role: string;
	avatarSrc?: string;
	submitStatus: SubmitStatus;
	score?: number;
}

export type NoticeTag = 'default' | 'assignment' | 'individual' | 'team' | 'etc';

export interface AssignmentDetailProps {
	title: string;
	date: string;
	readCount: number;
	content: string;
	tags: NoticeTag[];
}
