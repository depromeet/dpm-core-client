const AWAITING_APPROVAL_KEY = 'dpm_awaiting_approval';

/** 검토중 화면을 본 기기임을 기록한다. 승인 후 홈에 들어오면 인증완료 화면을 한 번 보여준다. */
export const markAwaitingApproval = () => {
	try {
		window.localStorage.setItem(AWAITING_APPROVAL_KEY, 'true');
	} catch {
		// 저장소 접근이 막힌 환경에서는 인증완료 화면을 건너뛴다.
	}
};

export const isAwaitingApproval = (): boolean => {
	try {
		return window.localStorage.getItem(AWAITING_APPROVAL_KEY) === 'true';
	} catch {
		return false;
	}
};

export const clearAwaitingApproval = () => {
	try {
		window.localStorage.removeItem(AWAITING_APPROVAL_KEY);
	} catch {
		// 무시
	}
};
