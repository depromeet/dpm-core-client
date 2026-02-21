'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@dpm-core/shared';

export const EmailLoginButton = () => {
	const router = useRouter();

	const handleLoginEmail = () => {
		router.push('/login/email');
	};

	return (
		<Button variant="text" size="md" onClick={handleLoginEmail}>
			이메일로 로그인
		</Button>
	);
};
