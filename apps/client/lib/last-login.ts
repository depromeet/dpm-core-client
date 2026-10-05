import type { LoginMethod } from '@dpm-core/api';

const LAST_LOGIN_METHOD_KEY = 'dpm_last_login_method';
const KAKAO_PROMPT_DISMISSED_KEY = 'dpm_kakao_prompt_dismissed';
const KAKAO_LOGIN_TOAST_KEY = 'dpm_kakao_login_toast';

const LOGIN_METHODS: readonly LoginMethod[] = ['KAKAO', 'APPLE', 'EMAIL'];

export const getLastLoginMethod = (): LoginMethod | null => {
	try {
		const value = window.localStorage.getItem(LAST_LOGIN_METHOD_KEY);
		return LOGIN_METHODS.find((method) => method === value) ?? null;
	} catch {
		return null;
	}
};

export const setLastLoginMethod = (method: LoginMethod) => {
	try {
		window.localStorage.setItem(LAST_LOGIN_METHOD_KEY, method);
	} catch {
		// 저장소 접근이 막힌 환경에서는 배지만 표시하지 않는다.
	}
};

export const isKakaoPromptDismissed = (): boolean => {
	try {
		return window.sessionStorage.getItem(KAKAO_PROMPT_DISMISSED_KEY) === 'true';
	} catch {
		return false;
	}
};

export const dismissKakaoPrompt = () => {
	try {
		window.sessionStorage.setItem(KAKAO_PROMPT_DISMISSED_KEY, 'true');
	} catch {
		// 저장소 접근이 막힌 환경에서는 매 진입마다 다시 노출된다.
	}
};

/** 카카오 로그인 유도 시트에서 로그인한 뒤 홈에서 안내 토스트를 띄우기 위한 표시 */
export const markKakaoLoginToast = () => {
	try {
		window.sessionStorage.setItem(KAKAO_LOGIN_TOAST_KEY, 'true');
	} catch {
		// 저장소 접근이 막힌 환경에서는 토스트만 생략된다.
	}
};

export const consumeKakaoLoginToast = (): boolean => {
	try {
		const isMarked = window.sessionStorage.getItem(KAKAO_LOGIN_TOAST_KEY) === 'true';
		window.sessionStorage.removeItem(KAKAO_LOGIN_TOAST_KEY);
		return isMarked;
	} catch {
		return false;
	}
};
