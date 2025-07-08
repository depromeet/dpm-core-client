'use client';

import { pressInOutVariatns } from '@/variants';
import { type MotionProps, motion } from 'motion/react';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { Button } from './ui/button';

const MotionButton = motion.create(Button);

const LoginButton = forwardRef<
	HTMLButtonElement,
	ComponentPropsWithoutRef<typeof Button> & MotionProps
>((props, ref) => {
	return (
		<MotionButton ref={ref} {...props} {...pressInOutVariatns}>
			<svg
				width="20"
				height="18"
				viewBox="0 0 20 18"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title>카카오 로고</title>
				<path
					d="M10 0.5C4.75312 0.5 0.5 3.77399 0.5 7.81494C0.5 10.4443 2.30098 12.7486 5.00604 14.038C4.80693 14.7595 4.28673 16.6551 4.18269 17.0604C4.05353 17.5635 4.37104 17.5565 4.58091 17.422C4.74415 17.3154 7.18372 15.6994 8.23669 15.0023C8.80891 15.0845 9.39728 15.1281 10 15.1281C15.2469 15.1281 19.5 11.8541 19.5 7.81494C19.5 3.77574 15.2469 0.5 10 0.5Z"
					fill="black"
					fillOpacity="0.9"
				/>
			</svg>
			<p className="text-[15px] w-full text-center">카카오로 시작하기</p>
		</MotionButton>
	);
});

LoginButton.displayName = 'LoginButton';

export { LoginButton };
