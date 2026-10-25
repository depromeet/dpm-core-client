/**
 * 푸시 알림 data(서버가 보내는 `type` + id)를 웹 경로로 변환한다.
 * 서버는 경로를 내려주지 않으므로 허용된 type만 앱이 직접 경로를 만든다.
 * 매핑에 없는 type이나 id가 올바르지 않은 data는 null(= 이동하지 않음).
 */

const toId = (value: unknown): number | null => {
	const id = typeof value === 'string' ? Number(value) : value;
	return typeof id === 'number' && Number.isSafeInteger(id) && id > 0 ? id : null;
};

const ANNOUNCEMENT_TYPES = new Set([
	'ANNOUNCEMENT_NEW',
	'ANNOUNCEMENT_REMIND',
	'ASSIGNMENT_NEW',
	'ASSIGNMENT_SUBMIT_REQUEST',
	'ASSIGNMENT_SUBMIT_REQUEST_TO_MEMBERS',
	'ASSIGNMENT_DUE_24H',
	'ASSIGNMENT_DUE_12H',
	'ASSIGNMENT_DUE_1H',
]);

export function getNotificationPath(data: Record<string, unknown> | null | undefined) {
	const type = data?.type;
	if (typeof type !== 'string') return null;

	if (ANNOUNCEMENT_TYPES.has(type)) {
		const announcementId = toId(data?.announcementId);
		return announcementId && `/announcement/${announcementId}`;
	}

	switch (type) {
		case 'SESSION_DAY_BEFORE': {
			const sessionId = toId(data?.sessionId);
			return sessionId && `/session/${sessionId}`;
		}
		case 'SESSION_FEEDBACK_OPENED': {
			const sessionId = toId(data?.sessionId);
			return sessionId && `/session/${sessionId}/feedback`;
		}
		case 'AFTER_PARTY_INVITATION': {
			const afterPartyId = toId(data?.afterPartyId);
			return afterPartyId && `/after-party/${afterPartyId}`;
		}
		// 출석 체크는 홈의 출석 배너/바텀시트에서 진행한다.
		case 'ATTENDANCE_STARTED':
			return '/';
		default:
			return null;
	}
}
