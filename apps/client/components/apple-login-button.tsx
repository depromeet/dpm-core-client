'use client';

import { AppleLogo } from '@dpm-core/shared';

import { getAppleAuthUrl } from '@/lib/env';

import { Pressable } from './motion';

interface AppleLoginButtonProps {
	className?: string;
}

const AppleLoginButton = ({ className }: AppleLoginButtonProps) => {
	return (
		<Pressable variant="none" size="full" className={className} asChild>
			<a
				href={getAppleAuthUrl()}
				className="flex items-center justify-center gap-3.75 font-medium text-body1"
			>
				<AppleLogo />
				<p>Apple로 시작하기</p>
			</a>
		</Pressable>
	);
};

export { AppleLoginButton };
