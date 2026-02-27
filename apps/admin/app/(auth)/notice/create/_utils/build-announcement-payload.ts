import type { CreateAnnouncementRequest } from '@dpm-core/api';

import type { NoticeSchema } from '../_schemas/notice-schema';

/** Date + HHMM(4자리) → ISO date-time 문자열 */
function toISOAt(date: Date, timeHHMM: string): string {
	const hours = Number.parseInt(timeHHMM.slice(0, 2), 10);
	const minutes = Number.parseInt(timeHHMM.slice(2, 4), 10);
	const d = new Date(date);
	d.setHours(hours, minutes, 0, 0);
	return d.toISOString();
}

/** 폼 데이터를 공지 등록 API body로 변환 */
export function buildAnnouncementPayload(data: NoticeSchema): CreateAnnouncementRequest {
	const announcementType =
		data.category === 'assignment' ? 'ASSIGNMENT' : 'GENERAL';

	const payload: CreateAnnouncementRequest = {
		announcementType,
		title: data.title,
		content: data.content,
		submitLink: data.submissionLink ?? '',
		shouldSendNotification: data.sendNotification,
	};

	if (data.category === 'assignment') {
		payload.submitType =
			data.assignmentType === 'team' ? 'TEAM' : 'INDIVIDUAL';
		if (
			data.submissionStartDate != null &&
			data.submissionStartTime != null &&
			data.submissionStartTime.length === 4
		) {
			payload.startAt = toISOAt(
				data.submissionStartDate,
				data.submissionStartTime,
			);
		}
		if (
			data.submissionEndDate != null &&
			data.submissionEndTime != null &&
			data.submissionEndTime.length === 4
		) {
			payload.dueAt = toISOAt(
				data.submissionEndDate,
				data.submissionEndTime,
			);
		}
	}

	if (
		data.isScheduled &&
		data.scheduledDate != null &&
		data.scheduledTime != null &&
		data.scheduledTime.length === 4
	) {
		payload.scheduledAt = toISOAt(data.scheduledDate, data.scheduledTime);
	}

	return payload;
}
