'use client';

import { Button, KakaoLogo, pressInOutVariatns } from '@dpm-core/shared';
import { motion } from 'motion/react';
import { forwardRef } from 'react';

const MotionButton = motion.create(Button);

interface LoginButtonProps {
	href?: string;
	variant?: 'primary' | 'secondary' | 'assistive' | 'text';
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
	className?: string;
}

const LoginButton = forwardRef<HTMLButtonElement, LoginButtonProps>(
	({ variant, size, className, ...props }, ref) => {
		const loginUrl = new URL('https://dev.dpmcore.o-r.kr/login/kakao');
		return (
			<MotionButton
				ref={ref}
				{...pressInOutVariatns}
				variant={variant}
				size={size}
				className={className}
				asChild
			>
				<a href={loginUrl.toString()} className="flex items-center gap-2 text-sm font-medium">
					<KakaoLogo />
					카카오 로그인
				</a>
			</MotionButton>
		);
	},
);

LoginButton.displayName = 'LoginButton';

export { LoginButton };
