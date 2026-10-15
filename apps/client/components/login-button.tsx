'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { type Button, KakaoLogo } from '@dpm-core/shared';

import { useKakaoLogin } from '@/hooks/use-kakao-login';

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

		const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
