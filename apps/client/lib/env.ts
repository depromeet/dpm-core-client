import { IS_PROD } from '@dpm-core/api';

/**
 * Apple OAuth 관련 환경변수
 */
export const getAppleClientId = (): string => {
	return process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? '';
};

export const getAppleRedirectUri = (): string => {
	// 로컬 등에서 별도 콜백을 쓰고 싶을 때 .env.local 로 덮어쓴다.
	if (process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI) {
		return process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI;
	}
	if (IS_PROD) {
		return 'https://core.depromeet.com/login/apple/callback';
	}
	return 'https://dev.depromeet.com/login/apple/callback';
};

/**
 * Apple OAuth URL 생성
 */
export const getAppleAuthUrl = (): string => {
	const baseUrl = 'https://appleid.apple.com/auth/authorize';
	const params = new URLSearchParams({
		client_id: getAppleClientId(),
		redirect_uri: getAppleRedirectUri(),
		response_type: 'code id_token',
		scope: 'name email',
		response_mode: 'form_post',
	});

	return `${baseUrl}?${params.toString()}`;
};
