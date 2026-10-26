'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from '@dpm-core/shared';

const LOGIN_ERROR_MESSAGE_BY_CODE: Record<string, string> = {
	'MEMBER-401-02': '탈퇴한 계정이에요. 로그인할 수 없어요.',
};

/**
 * 소셜 로그인 콜백이 실패하면 `/login?error=...` 로 돌려보낸다.
 * (애플 콜백은 `error`, 카카오 서버 리다이렉트는 `errorCode` 로 실패 코드를 내려준다.)
 * 사용자에게 실패를 알리고, 새로고침해도 반복되지 않도록 주소에서 값을 지운다.
 */
export const LoginErrorToast = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const errorCode = searchParams.get('error') ?? searchParams.get('errorCode');

	useEffect(() => {
		if (errorCode === null) return;

		toast.error(
			LOGIN_ERROR_MESSAGE_BY_CODE[errorCode] ?? '로그인에 실패했어요. 다시 시도해주세요.',
		);
		router.replace(pathname);
	}, [errorCode, pathname, router]);

	return null;
};
