'use client';

import { pressInOutVariatns } from '@/variants';
import { type MotionProps, motion } from 'motion/react';
import Link from 'next/link';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { KakaoLogo } from './icons/kakao-logo';
import { Button } from './ui/button';

const MotionButton = motion.create(Button);

const LoginButton = forwardRef<
	HTMLButtonElement,
	ComponentPropsWithoutRef<typeof Button> & MotionProps
>((props, ref) => {
	return (
		<MotionButton ref={ref} {...props} {...pressInOutVariatns} asChild>
			<Link href="https://dev.dpmcore.o-r.kr/login">
				<KakaoLogo />
				<p className="text-[15px] w-full text-center">카카오로 시작하기</p>
			</Link>
		</MotionButton>
	);
});

LoginButton.displayName = 'LoginButton';

export { LoginButton };
