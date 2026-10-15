'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from '@dpm-core/shared';

/**
 * 소셜 로그인 콜백이 실패하면 `/login?error=...` 로 돌려보낸다.
 * 사용자에게 실패를 알리고, 새로고침해도 반복되지 않도록 주소에서 값을 지운다.
 */
export const LoginErrorToast = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const hasError = searchParams.has('error');

	useEffect(() => {
		if (!hasError) return;

		toast.error('로그인에 실패했어요. 다시 시도해주세요.');
		router.replace(pathname);
	}, [hasError, pathname, router]);

	return null;
};
