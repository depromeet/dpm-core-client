'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { auth } from '@dpm-core/api';
import { toast } from '@dpm-core/shared';

import dpmLogo from '@/assets/images/dpm-logo.svg';

const TAP_THRESHOLD = 5;
const TAP_RESET_MS = 1000;

// Apple 심사관이 실제 로그인 방법(카카오·Apple) 없이도 심사용 계정으로 들어갈 수 있도록
// 운영 빌드에서도 동작한다. 자격증명은 전용 심사 계정(App Store Connect 심사 메모 참고)의
// 것으로, 코드에 하드코딩하지 않고 NEXT_PUBLIC_APP_REVIEW_LOGIN_EMAIL/PASSWORD로 분리한다.
export const LogoAppReviewLoginTrigger = () => {
	const tapCountRef = useRef(0);
	const tapResetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const router = useRouter();

	const handleTapLogo = async () => {
		const email = process.env.NEXT_PUBLIC_APP_REVIEW_LOGIN_EMAIL;
		const password = process.env.NEXT_PUBLIC_APP_REVIEW_LOGIN_PASSWORD;
		if (!email || !password) return;

		clearTimeout(tapResetTimerRef.current);
		tapCountRef.current += 1;

		if (tapCountRef.current < TAP_THRESHOLD) {
			tapResetTimerRef.current = setTimeout(() => {
				tapCountRef.current = 0;
			}, TAP_RESET_MS);
			return;
		}

		tapCountRef.current = 0;
		try {
			await auth.login({ email, password });
			router.replace('/');
		} catch {
			toast.error('심사용 계정 로그인에 실패했습니다.');
		}
	};

	return <Image src={dpmLogo} alt="DPM" priority onClick={handleTapLogo} className="h-auto w-31" />;
};
