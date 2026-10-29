'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { type Button, KakaoLogo } from '@dpm-core/shared';

import { CLARITY_ACTION_ID } from '@/constants/clarity';
import { useKakaoLogin } from '@/hooks/use-kakao-login';
import { deleteToken } from '@/lib/utils';
import { useClarity } from '@/providers/client-clarity-adapter';

import { Pressable } from './motion';

interface LoginButtonProps {
	href?: string;
	variant?: ComponentPropsWithoutRef<typeof Button>['variant'];
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
	className?: string;
}

const LoginButton = forwardRef<HTMLButtonElement, LoginButtonProps>(
	({ href, variant, size, className }, ref) => {
		const { canUseNativeKakao, loginWithNative, webFallbackUrl } = useKakaoLogin();
		const { track } = useClarity();

		const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
			track(CLARITY_ACTION_ID.LOGIN.KAKAO_LOGIN_CLICK);

			// 탈퇴·만료 등으로 남은 토큰이 로그인 요청에 실리면 서버가 401(JWT-401-1)을 반환하므로 먼저 비운다.
			deleteToken();

			if (!canUseNativeKakao) return;

			e.preventDefault();
			void loginWithNative();
		};

		return (
			<Pressable ref={ref} variant={variant} size={size} className={className} asChild>
				<a
					href={href ?? webFallbackUrl}
					onClick={handleClick}
					className="flex items-center justify-center gap-3.75 font-medium text-body1"
				>
					<KakaoLogo />
					<p className="text-[#000000] opacity-85">카카오로 시작하기</p>
				</a>
			</Pressable>
		);
	},
);

LoginButton.displayName = 'LoginButton';

export { LoginButton };
