import { type NextRequest, NextResponse } from 'next/server';
import { BASE_URL, COOKIE_KEYS } from '@dpm-core/api';

export async function POST(request: NextRequest) {
	try {
		const formData = (await request.formData()) as unknown as globalThis.FormData;
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
			credentials: 'include',
			body: JSON.stringify({ authorizationCode: code }),
		});

		if (!response.ok) {
			const url = new URL('/login', request.url);
			url.searchParams.set('error', `api_failed_${response.status}`);

			return NextResponse.redirect(url, { status: 303 });
		}

		const data = await response.json();
		const { accessToken, refreshToken } = data;

		const redirectResponse = NextResponse.redirect(new URL('/', request.url), { status: 303 });

		// core.depromeet.shop → .depromeet.shop (api 서브도메인과 쿠키 공유)
		const hostname = new URL(request.url).hostname;
		const domain = hostname.substring(hostname.indexOf('.'));

		redirectResponse.cookies.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
			httpOnly: false,
			secure: true,
			sameSite: 'lax',
			path: '/',
			domain,
		});
		redirectResponse.cookies.set(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
			httpOnly: false,
			secure: true,
			sameSite: 'lax',
			path: '/',
			domain,
		});

		return redirectResponse;
	} catch (e) {
		const url = new URL('/login', request.url);
		url.searchParams.set('error', `catch_${e instanceof Error ? e.message : 'unknown'}`);

		return NextResponse.redirect(url, { status: 303 });
	}
}
