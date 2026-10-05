'use client';

import { useRouter } from 'next/navigation';
import { MailIcon } from 'lucide-react';

export const EmailLoginButton = () => {
	const router = useRouter();

	const handleLoginEmail = () => {
		router.push('/login/email');
	};

	return (
		<button
			type="button"
			aria-label="이메일로 로그인"
			onClick={handleLoginEmail}
			className="flex size-12 items-center justify-center rounded-full border border-black/12 bg-white text-gray-400"
		>
			<MailIcon className="size-6.5" strokeWidth={1.25} />
		</button>
	);
};
