'use client';

import { BASE_URL } from '@dpm-core/api';
import { type Button, KakaoLogo } from '@dpm-core/shared';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { Pressable } from './motion';

interface LoginButtonProps {
	href?: string;
	variant?: ComponentPropsWithoutRef<typeof Button>['variant'];
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
	className?: string;
}

const LoginButton = forwardRef<HTMLButtonElement, LoginButtonProps>(
	({ variant, size, className }, ref) => {
		const loginUrl = new URL(BASE_URL ?? '');
		loginUrl.pathname = '/login/kakao';
		return (
			<Pressable ref={ref} variant={variant} size={size} className={className} asChild>
				<a href={loginUrl.toString()} className="flex items-center gap-2 text-sm font-medium">
					<KakaoLogo />
					<p className="flex-1 text-[#000000] opacity-85">카카오로 시작하기</p>
				</a>
			</Pressable>
		);
	},
);

LoginButton.displayName = 'LoginButton';

export { LoginButton };
