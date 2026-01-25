'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { AppleLogo, type Button } from '@dpm-core/shared';

import { getAppleAuthUrl } from '@/lib/env';

import { Pressable } from './motion';

interface AppleLoginButtonProps {
	variant?: ComponentPropsWithoutRef<typeof Button>['variant'];
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
	className?: string;
}

const AppleLoginButton = forwardRef<HTMLButtonElement, AppleLoginButtonProps>(
	({ variant, size, className }, ref) => {
		return (
			<Pressable ref={ref} variant={variant} size={size} className={className} asChild>
				<a href={getAppleAuthUrl()} className="flex items-center gap-2 font-medium text-sm">
					<AppleLogo />
					<p className="flex-1">Apple로 시작하기</p>
				</a>
			</Pressable>
		);
	},
);

AppleLoginButton.displayName = 'AppleLoginButton';

export { AppleLoginButton };
