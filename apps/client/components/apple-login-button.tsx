'use client';

import { AppleLogo } from '@dpm-core/shared';

import { getAppleAuthUrl } from '@/lib/env';

const AppleLoginButton = () => {
	return (
		<a
			href={getAppleAuthUrl()}
			aria-label="Apple로 시작하기"
			className="flex size-12 items-center justify-center rounded-full border border-black/12 bg-white text-black"
		>
			<AppleLogo className="size-7.5" />
		</a>
	);
};

export { AppleLoginButton };
