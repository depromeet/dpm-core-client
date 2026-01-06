'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { AppleLogo, type Button } from '@dpm-core/shared';

import { Pressable } from './motion';

interface AppleLoginButtonProps {
	variant?: ComponentPropsWithoutRef<typeof Button>['variant'];
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
	className?: string;
}

const AppleLoginButton = forwardRef<HTMLButtonElement, AppleLoginButtonProps>(
	({ variant, size, className }, ref) => {
		// TODO: 실제 Apple Client 정보 기입
		const appleAuthUrl = new URL('https://appleid.apple.com/auth/authorize');
		appleAuthUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? '');
		appleAuthUrl.searchParams.set('response_type', 'code');
		appleAuthUrl.searchParams.set('response_mode', 'form_post');
		appleAuthUrl.searchParams.set('scope', 'name email');
		appleAuthUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI ?? '');
		appleAuthUrl.searchParams.set('state', crypto.randomUUID()); // CSRF 방지

		return (
			<Pressable ref={ref} variant={variant} size={size} className={className} asChild>
				<a href={appleAuthUrl.toString()} className="flex items-center gap-2 font-medium text-sm">
					<AppleLogo />
					<p className="flex-1">Apple로 시작하기</p>
				</a>
			</Pressable>
		);
	},
);

AppleLoginButton.displayName = 'AppleLoginButton';

export { AppleLoginButton };
