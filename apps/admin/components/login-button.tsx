'use client';

import { useSearchParams } from 'next/navigation';
import { forwardRef } from 'react';

import { Button, KakaoLogo, pressInOutVariatns } from '@dpm-core/shared';
import { motion } from 'motion/react';

const MotionButton = motion.create(Button);

interface LoginButtonProps {
	href?: string;
	variant?: 'primary' | 'secondary' | 'assistive' | 'text';
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
	className?: string;
}

const LoginButton = forwardRef<HTMLButtonElement, LoginButtonProps>(
	({ variant, size, className, ...props }, ref) => {
		const searchParams = useSearchParams();
		const callbackUrl = searchParams.get('callbackUrl') || '/';

		// callbackUrl을 인코딩하여 카카오 로그인 URL에 포함
		const loginUrl = new URL('https://dev.dpmcore.o-r.kr/v1/login/kakao');
		loginUrl.searchParams.set('callbackUrl', callbackUrl);

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
