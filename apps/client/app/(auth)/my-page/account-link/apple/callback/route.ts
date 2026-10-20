import { type NextRequest, NextResponse } from 'next/server';

/**
 * 애플은 response_mode=form_post 로 code/state 를 POST form 으로 돌려준다.
 * React 페이지는 POST body 를 직접 받을 수 없으므로, 값을 쿼리로 옮겨 실제 완료 화면(GET)으로 보낸다.
 * 연결 완료 API 호출은 (로그인 세션이 필요하므로) 브라우저에 있는 완료 화면에서 수행한다.
 */
export async function POST(request: NextRequest) {
	const formData = (await request.formData()) as unknown as globalThis.FormData;
	const code = formData.get('code')?.toString();
	const state = formData.get('state')?.toString();
	const appleError = formData.get('error')?.toString();

	const url = new URL('/my-page/account-link/apple/complete', request.url);
	if (code) url.searchParams.set('code', code);
	if (state) url.searchParams.set('state', state);
	if (appleError) url.searchParams.set('error', appleError);

	return NextResponse.redirect(url, { status: 303 });
}
