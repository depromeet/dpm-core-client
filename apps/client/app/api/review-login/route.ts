import { NextResponse } from 'next/server';

/**
 * 심사용 계정 정보를 내려준다. (로그인 화면 로고 5번 탭)
 * 서버 환경변수 REVIEW_LOGIN_EMAIL / REVIEW_LOGIN_PASSWORD 가 모두 있을 때만 동작한다.
 * 비밀번호가 클라이언트 번들에 들어가지 않도록 환경변수는 NEXT_PUBLIC_ 을 쓰지 않는다.
 * 심사가 끝나면 환경변수를 지워 기능을 끄고, 계정 비밀번호도 변경한다.
 */
export const dynamic = 'force-dynamic';

export function GET() {
	const email = process.env.REVIEW_LOGIN_EMAIL;
	const password = process.env.REVIEW_LOGIN_PASSWORD;

	if (!email || !password) {
		return new NextResponse(null, { status: 404 });
	}

	return NextResponse.json({ email, password }, { headers: { 'Cache-Control': 'no-store' } });
}
