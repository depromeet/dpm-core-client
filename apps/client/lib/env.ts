type Stage = 'development' | 'production';

const getStage = (): Stage => {
	const stage = process.env.NEXT_PUBLIC_STAGE;
	if (stage === 'production') return 'production';

	return 'development';
};

export const IS_PROD = getStage() === 'production';

/**
 * Apple OAuth 관련 환경변수
 */
export const getAppleClientId = (): string => {
	return process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? '';
};

export const getAppleRedirectUri = (): string => {
	if (IS_PROD) {
		return 'https://api.depromeet.com/login/oauth2/code/apple';
	}
	return 'https://api.depromeet.shop/login/oauth2/code/apple';
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
