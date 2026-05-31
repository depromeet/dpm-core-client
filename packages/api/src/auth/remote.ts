import { BASE_URL, http } from '../http';
import type { ApiResponse } from '../type';
import { setAuthCookies, setCookie } from './cookie';

interface ReissueResponse {
	token: string;
	expirationTime: number;
}

interface KakaoNativeLoginResponse {
	loginStatus: string;
	accessToken: string;
	refreshToken: string;
	memberId: number;
	memberStatus: string;
	signupContext: unknown | null;
}

export const auth = {
	reissue: async () => {
		const res = await http.get<ReissueResponse>('v1/reissue');
		setCookie(res.data.token, res.data.expirationTime);
		return res;
	},
	login: async (params: { email: string; password: string }) => {
		const res = await http.post('login/email', { json: params });
		return res;
	},
	// 카카오 SDK accessToken을 Authorization 헤더로 전달.
	// http 인스턴스의 beforeRequest hook이 우리 토큰으로 덮어쓰는 걸 피하려고 fetch 직접 사용.
	kakaoLogin: async (params: { accessToken: string }) => {
		console.log('[kakaoLogin] request', { kakaoAccessToken: params.accessToken });

		const res = await fetch(`${BASE_URL}/v1/auth/kakao/native`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${params.accessToken}`,
			},
			credentials: 'include',
		});

		console.log('[kakaoLogin] response status', res.status);

		if (!res.ok) {
			throw new Error(`Kakao native login failed: ${res.status}`);
		}

		const json: ApiResponse<KakaoNativeLoginResponse> = await res.json();
		console.log('[kakaoLogin] tokens', {
			accessToken: json.data.accessToken,
			refreshToken: json.data.refreshToken,
			memberId: json.data.memberId,
			memberStatus: json.data.memberStatus,
			loginStatus: json.data.loginStatus,
		});

		setAuthCookies({
			accessToken: json.data.accessToken,
			refreshToken: json.data.refreshToken,
		});
		return json;
	},
	logout: async () => {
		const res = await http.post('logout');
		return res;
	},
};
