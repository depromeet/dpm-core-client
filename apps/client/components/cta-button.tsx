'use client';

import { cn, useAppShell } from '@dpm-core/shared';
import { Loader2Icon } from 'lucide-react';
import { type HTMLMotionProps, motion } from 'motion/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useKeyboardTop } from '@/hooks/use-keyboard-top';
import { MotionButton } from './motion';

interface CtaButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
	text: string;
	isLoading?: boolean;
	onKeyboardOpen?: () => void;
	onKeyboardClose?: () => void;
}

const CtaButton = ({
	text,
	isLoading,
	onKeyboardOpen,
	onKeyboardClose,
	...props
}: CtaButtonProps) => {
	const [isButtonPressed, setIsButtonPressed] = useState(false);
	const { ref } = useAppShell();
	const buttonRef = useKeyboardTop<HTMLButtonElement>({
		onKeyboardOpen,
		onKeyboardClose,
	});
	return createPortal(
		<MotionButton
			variant="secondary"
			size="full"
			{...props}
			className={cn('rounded-none', props.className)}
			onClick={(event) => {
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
