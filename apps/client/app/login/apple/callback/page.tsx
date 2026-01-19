'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { auth, COOKIE_KEYS } from '@dpm-core/api';

const AppleCallbackPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const isProcessing = useRef(false);

	useEffect(() => {
		const handleAppleLogin = async () => {
			if (isProcessing.current) return;
			isProcessing.current = true;

			const code = searchParams.get('code');
			const error = searchParams.get('error');

			if (error || !code) {
				router.replace('/login');
				return;
			}

			try {
				const res = await auth.appleLogin(code);
				const { accessToken, refreshToken } = res.data;

				Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken);
				Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, refreshToken);

				router.replace('/');
			} catch {
				router.replace('/login');
			}
		};

		handleAppleLogin();
	}, [router, searchParams]);

	return null;
};

export default AppleCallbackPage;
