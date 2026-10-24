'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import dpmLogo from '@/assets/images/dpm-logo.svg';

const REQUIRED_TAP_COUNT = 3;
const TAP_WINDOW_MS = 3000;

/**
 * 로고를 3초 안에 3번 탭하면 이메일 로그인 화면(/login/email)으로 이동한다.
 * 카카오·Apple 계정이 없어도 이메일 로그인 폼에 접근할 수 있는 숨김 경로.
 */
export const DpmLogoEmailLoginTrigger = () => {
	const router = useRouter();
	const tapCount = useRef(0);
	const lastTapAt = useRef(0);

	const handleTap = () => {
		const now = Date.now();
		tapCount.current = now - lastTapAt.current > TAP_WINDOW_MS ? 1 : tapCount.current + 1;
		lastTapAt.current = now;

		if (tapCount.current < REQUIRED_TAP_COUNT) return;

		tapCount.current = 0;
		router.push('/login/email');
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
