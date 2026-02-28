'use client';

import { useState } from 'react';
import { Loader2Icon } from 'lucide-react';
import { type HTMLMotionProps, motion } from 'motion/react';
import { createPortal } from 'react-dom';
import { cn, useAppShell, useKeyboardTop } from '@dpm-core/shared';

import { MotionButton } from './motion';

interface CtaButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
	text: string;
	isLoading?: boolean;
	onKeyboardStateChange?: (isKeyboardOpen: boolean) => void;
}

const CtaButton = ({ text, isLoading, onKeyboardStateChange, ...props }: CtaButtonProps) => {
	const [isButtonPressed, setIsButtonPressed] = useState(false);
	const { ref } = useAppShell();
	const buttonRef = useKeyboardTop<HTMLButtonElement>({
		onKeyboardStateChange,
	});
	return createPortal(
		<MotionButton
			variant="secondary"
			size="full"
			{...props}
			style={{
				...props.style,
				maxWidth: ref.current.clientWidth,
			}}
			className={cn('rounded-none', props.className)}
			onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
				if (isLoading) {
					event.preventDefault();
					return;
				}
				props.onClick?.(event);
			}}
			onTapStart={() => setIsButtonPressed(true)}
			onTap={() => setIsButtonPressed(false)}
			onTapCancel={() => setIsButtonPressed(false)}
			ref={buttonRef}
		>
			{isLoading ? (
				<Loader2Icon className="animate-spin" />
			) : (
				<motion.p animate={{ scale: isButtonPressed ? 0.9 : 1 }}>{text}</motion.p>
			)}
		</MotionButton>,
		ref.current,
	);
};

export { CtaButton };
