'use client';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@dpm-core/shared';

import { loginMutationOptions } from '@/remotes/mutations/auth';

const TAP_THRESHOLD = 3;
const TAP_RESET_MS = 1000;
const LOCAL_HOSTNAMES = ['localhost', '127.0.0.1', 'local-admin.depromeet.com'];

// NEXT_PUBLIC_STAGE 설정 실수로 운영에 올라가도 동작하지 않도록 hostname을 함께 확인한다.
const isLocalEnvironment = () =>
	process.env.NODE_ENV === 'development' &&
	typeof window !== 'undefined' &&
	LOCAL_HOSTNAMES.includes(window.location.hostname);

export const AdminDevLoginTrigger = () => {
	const tapCountRef = useRef(0);
	const tapResetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const router = useRouter();

	const { mutate: login } = useMutation(
		loginMutationOptions({
			onSuccess: () => {
				router.replace('/');
			},
			onError: () => {
				toast.error('dev 계정 로그인에 실패했습니다.');
			},
		}),
	);

	const handleTapAdmin = () => {
		if (!isLocalEnvironment()) return;

		const email = process.env.NEXT_PUBLIC_DEV_LOGIN_EMAIL;
		const password = process.env.NEXT_PUBLIC_DEV_LOGIN_PASSWORD;
		if (!email || !password) return;

		clearTimeout(tapResetTimerRef.current);
		tapCountRef.current += 1;

		if (tapCountRef.current >= TAP_THRESHOLD) {
			tapCountRef.current = 0;
			login({ email, password });
			return;
		}

		tapResetTimerRef.current = setTimeout(() => {
			tapCountRef.current = 0;
		}, TAP_RESET_MS);
	};

	return (
		<p
			onClick={handleTapAdmin}
			className="absolute left-[105%] font-semibold text-body2 text-primary-strong lowercase leading-none"
		>
			admin
		</p>
	);
};
