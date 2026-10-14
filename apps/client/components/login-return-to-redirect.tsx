'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { http } from '@dpm-core/api';

import { consumeLoginReturnTo } from '@/lib/login-return-to';

export const LoginReturnToRedirect = () => {
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		if (pathname !== '/') return;

		const returnTo = consumeLoginReturnTo();
		if (!returnTo || !http.getDefaultToken()) return;

		router.replace(returnTo);
	}, [pathname, router]);

	return null;
};
