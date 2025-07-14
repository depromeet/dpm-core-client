'use client';

import { motion } from 'motion/react';
import { forwardRef } from 'react';

import { pressInOutVariatns } from '../variants';
import { KakaoLogo } from './icons/kakao-logo';
import { Button } from './ui/button';

const MotionButton = motion(Button);

interface LoginButtonProps {
	href?: string;
	variant?: 'primary' | 'secondary' | 'assistive' | 'text';
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
	className?: string;
}

const LoginButton = forwardRef<HTMLButtonElement, LoginButtonProps>(
	({ variant, size, className, ...props }, ref) => {
		return (
			<MotionButton
				ref={ref}
				{...pressInOutVariatns}
				variant={variant}
				size={size}
				className={className}
				asChild
			>
				<a
					href={'https://dev.dpmcore.o-r.kr/login'}
					className="flex items-center gap-2 text-sm font-medium"
				>
					<KakaoLogo />
					카카오 로그인
				</a>
			</MotionButton>
		);
	},
);

LoginButton.displayName = 'LoginButton';

export { LoginButton };
