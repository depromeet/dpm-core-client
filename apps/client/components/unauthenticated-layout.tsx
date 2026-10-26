import { RedirectType, redirect } from 'next/navigation';

interface UnauthenticatedLayoutProps {
	returnTo?: string;
	/** 서버가 로그인 콜백 실패 시 주소에 붙여준 코드. 로그인 화면에서 안내 토스트로 보여준다. */
	errorCode?: string | null;
}

function UnauthenticatedLayout({ returnTo, errorCode }: UnauthenticatedLayoutProps) {
	const params = new URLSearchParams();
	if (returnTo) params.set('returnTo', returnTo);
	if (errorCode) params.set('error', errorCode);

	const query = params.toString();
	return redirect(query ? `/login?${query}` : '/login', RedirectType.replace);
}

export { UnauthenticatedLayout };
