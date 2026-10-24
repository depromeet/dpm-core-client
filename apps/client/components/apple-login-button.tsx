'use client';

import { AppleLogo } from '@dpm-core/shared';

import { getAppleAuthUrl } from '@/lib/env';
import { deleteToken } from '@/lib/utils';

import { Pressable } from './motion';

interface AppleLoginButtonProps {
	className?: string;
}

const AppleLoginButton = ({ className }: AppleLoginButtonProps) => {
	return (
		<Pressable variant="none" size="full" className={className} asChild>
			<a
				href={getAppleAuthUrl()}
				// 탈퇴·만료 등으로 남은 토큰이 로그인 요청에 실리면 서버가 401을 반환하므로 먼저 비운다.
				onClick={deleteToken}
				className="flex items-center justify-center gap-3.75 font-medium text-body1"
			>
				<AppleLogo />
				<p>Apple로 시작하기</p>
			</a>
		</Pressable>
	);
};

export { AppleLoginButton };
