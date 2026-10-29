'use client';

import { AppleLogo } from '@dpm-core/shared';

import { CLARITY_ACTION_ID } from '@/constants/clarity';
import { getAppleAuthUrl } from '@/lib/env';
import { deleteToken } from '@/lib/utils';
import { useClarity } from '@/providers/client-clarity-adapter';

import { Pressable } from './motion';

interface AppleLoginButtonProps {
	className?: string;
}

const AppleLoginButton = ({ className }: AppleLoginButtonProps) => {
	const { track } = useClarity();

	const handleClick = () => {
		track(CLARITY_ACTION_ID.LOGIN.APPLE_LOGIN_CLICK);
		// 탈퇴·만료 등으로 남은 토큰이 로그인 요청에 실리면 서버가 401을 반환하므로 먼저 비운다.
		deleteToken();
	};

	return (
		<Pressable variant="none" size="full" className={className} asChild>
			<a
				href={getAppleAuthUrl()}
				onClick={handleClick}
				className="flex items-center justify-center gap-3.75 font-medium text-body1"
			>
				<AppleLogo />
				<p>Apple로 시작하기</p>
			</a>
		</Pressable>
	);
};

export { AppleLoginButton };
