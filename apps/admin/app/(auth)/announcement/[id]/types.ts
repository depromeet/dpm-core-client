import type { ServerSubmitStatus } from '@dpm-core/api';
import type { SubmissionStatus, SubmitStatus } from '@dpm-core/shared';

const SERVER_TO_CLIENT_STATUS: Record<ServerSubmitStatus, SubmitStatus> = {
	PENDING: 'pending',
	SUBMITTED: 'completed',
	LATE_SUBMITTED: 'late',
	NOT_SUBMITTED: 'not-submitted',
};

export const toClientSubmitStatus = (serverStatus?: ServerSubmitStatus): SubmitStatus =>
	serverStatus ? SERVER_TO_CLIENT_STATUS[serverStatus] : 'not-submitted';

const CLIENT_TO_SERVER_STATUS: Record<SubmissionStatus, ServerSubmitStatus> = {
	pending: 'PENDING',
	completed: 'SUBMITTED',
	late: 'LATE_SUBMITTED',
	not_submitted: 'NOT_SUBMITTED',
};

export const toServerSubmitStatus = (clientStatus: SubmissionStatus): ServerSubmitStatus =>
	CLIENT_TO_SERVER_STATUS[clientStatus];

export const submitStatusToServer = (status: SubmitStatus): ServerSubmitStatus => {
	const invertedMap = Object.fromEntries(
		Object.entries(SERVER_TO_CLIENT_STATUS).map(([k, v]) => [v, k]),
	) as Record<SubmitStatus, ServerSubmitStatus>;
	return invertedMap[status];
};

export interface Member {
	id: string;
	name: string;
	team: string;
	teamId: number;
	role: string;
	avatarSrc?: string;
	submitStatus: SubmitStatus;
	isRead: boolean;
	score?: number;
	submitLink?: string;
}

export type NoticeTag = 'default' | 'assignment' | 'individual' | 'team' | 'etc';

export interface AssignmentDetailProps {
	announcementId: number;
	title: string;
	date: string;
	readCount: number;
	content: string;
	tags: NoticeTag[];
}
