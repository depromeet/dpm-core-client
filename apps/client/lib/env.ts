import { IS_PROD, type LinkableLoginMethod } from '@dpm-core/api';

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

/**
 * 계정 연동(카카오·애플 연결) OAuth 콜백 URL
 * 백엔드의 "서버에 허용된 origin" 검증을 통과해야 하고, 제공자(카카오·애플) 콘솔에도
 * 동일한 경로가 등록되어 있어야 한다.
 */
export const getAccountLinkRedirectUri = (provider: LinkableLoginMethod): string => {
	const origin = IS_PROD ? 'https://core.depromeet.com' : 'https://dev.depromeet.com';
	const path =
		provider === 'KAKAO'
			? '/my-page/account-link/kakao/callback'
			: '/my-page/account-link/apple/callback';

	return `${origin}${path}`;
};
