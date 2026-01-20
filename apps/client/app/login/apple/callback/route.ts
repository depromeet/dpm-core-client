import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { BASE_URL, COOKIE_KEYS } from '@dpm-core/api';

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const code = formData.get('code')?.toString();
		const error = formData.get('error')?.toString();

		if (error || !code) {
			return NextResponse.redirect(new URL('/login', request.url));
		}

		const response = await fetch(`${BASE_URL}/login/auth/apple`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ authorizationCode: code }),
		});

		if (!response.ok) {
			return NextResponse.redirect(new URL('/login', request.url));
		}

		const data = await response.json();
		const { accessToken, refreshToken } = data.data;

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

		return NextResponse.redirect(new URL('/', request.url));
	} catch {
		return NextResponse.redirect(new URL('/login', request.url));
	}
}
