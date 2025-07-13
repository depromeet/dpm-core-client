'use client';

import { pressInOutVariatns } from '@/variants';
import { type MotionProps, motion } from 'motion/react';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';

import { Button } from '@dpm-core/shared';
import { KakaoLogo } from './icons/kakao-logo';

const MotionButton = motion.create(Button);

const LoginButton = forwardRef<
	HTMLButtonElement,
	ComponentPropsWithoutRef<typeof Button> & MotionProps
>(({ ...props }, ref) => {
	return (
		<MotionButton ref={ref} {...props} {...pressInOutVariatns} asChild>
			<a href="/api/auth/sign-in/kakao" className="flex items-center gap-2 text-sm font-medium">
				<KakaoLogo />
				카카오 로그인
			</a>
		</MotionButton>
	);
});

LoginButton.displayName = 'LoginButton';

export { LoginButton };
