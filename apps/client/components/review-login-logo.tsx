'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { auth } from '@dpm-core/api';
import { toast } from '@dpm-core/shared';

import dpmLogo from '@/assets/images/dpm-logo.svg';

const REQUIRED_TAP_COUNT = 5;
const TAP_WINDOW_MS = 3000;

/**
 * 앱 심사용 숨김 로그인: 로고를 짧은 시간 안에 5번 탭하면 심사용 계정으로 로그인한다.
 * 서버에 심사용 계정 환경변수가 없으면 아무 일도 일어나지 않는다. (App Store 심사 메모에 방법을 적어 둔다)
 */
export const ReviewLoginLogo = () => {
	const router = useRouter();
	const tapCount = useRef(0);
	const lastTapAt = useRef(0);
	const isLoggingIn = useRef(false);

	const handleTap = async () => {
		const now = Date.now();
		tapCount.current = now - lastTapAt.current > TAP_WINDOW_MS ? 1 : tapCount.current + 1;
		lastTapAt.current = now;

		if (tapCount.current < REQUIRED_TAP_COUNT || isLoggingIn.current) return;

		tapCount.current = 0;
		isLoggingIn.current = true;
		try {
			const response = await fetch('/api/review-login', { cache: 'no-store' });
			if (!response.ok) return;

			const credentials: { email: string; password: string } = await response.json();
			await auth.login(credentials);
			router.replace('/');
		} catch {
			toast.error('로그인에 실패했어요. 다시 시도해주세요.');
		} finally {
			isLoggingIn.current = false;
		}
	};

	return (
		<Image
			src={dpmLogo}
			alt="DPM"
			priority
			className="h-auto w-31"
			onClick={handleTap}
			draggable={false}
		/>
	);
};
