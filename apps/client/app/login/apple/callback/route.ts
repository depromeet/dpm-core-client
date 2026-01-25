import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { BASE_URL, COOKIE_KEYS } from '@dpm-core/api';

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const code = formData.get('code')?.toString();
		const appleError = formData.get('error')?.toString();

		if (appleError || !code) {
			const url = new URL('/login', request.url);
			url.searchParams.set('error', 'apple_no_code');
			return NextResponse.redirect(url, { status: 303 });
		}

		const response = await fetch(`${BASE_URL}/login/auth/apple`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ authorizationCode: code }),
		});

		if (!response.ok) {
			const url = new URL('/login', request.url);
			url.searchParams.set('error', `api_failed_${response.status}`);

			// ---------- 에러 응답 본문 파싱 시도 ----------
			try {
				const clonedResponse = response.clone();
				const errorData = await clonedResponse.json();

				if (errorData.code) {
					url.searchParams.set('code', errorData.code);
				}
				if (errorData.message) {
					const message =
						errorData.message.length > 200
							? errorData.message.substring(0, 200) + '...'
							: errorData.message;
					url.searchParams.set('message', message);
				}
				if (errorData.status) {
					url.searchParams.set('api_status', errorData.status);
				}
			} catch {
				url.searchParams.set('response', 'unknown_error');
			}
			// ---------- 에러 응답 본문 파싱 시도 종료 ----------

			return NextResponse.redirect(url, { status: 303 });
		}

		const data = await response.json();
		const { accessToken, refreshToken } = data;

		const cookieStore = await cookies();
		cookieStore.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
			httpOnly: false,
			secure: true,
			sameSite: 'lax',
			path: '/',
		});
		cookieStore.set(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
			httpOnly: false,
			secure: true,
			sameSite: 'lax',
			path: '/',
		});

		return NextResponse.redirect(new URL('/', request.url), { status: 303 });
	} catch (e) {
		const url = new URL('/login', request.url);
		url.searchParams.set('error', `catch_${e instanceof Error ? e.message : 'unknown'}`);
		return NextResponse.redirect(url, { status: 303 });
	}
}
