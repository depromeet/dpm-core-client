'use client';

import { useState } from 'react';
import { type HTMLMotionProps, motion } from 'motion/react';

import { MotionButton } from './motion';

interface CtaButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
	text: string;
}

const CtaButton = ({ text, ...props }: CtaButtonProps) => {
	const [isButtonPressed, setIsButtonPressed] = useState(false);
	return (
		<MotionButton
			variant="secondary"
			size="full"
			className="rounded-none"
			{...props}
			onTapStart={() => setIsButtonPressed(true)}
			onTap={() => setIsButtonPressed(false)}
			onTapCancel={() => setIsButtonPressed(false)}
		>
			<motion.p animate={{ scale: isButtonPressed ? 0.9 : 1 }}>{text}</motion.p>
		</MotionButton>
	);
};

export { CtaButton };
