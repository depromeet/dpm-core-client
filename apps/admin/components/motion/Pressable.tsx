'use client';

import type { HTMLMotionProps } from 'motion/react';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { MotionButton } from '.';

const Pressable = forwardRef<
	HTMLButtonElement,
	HTMLMotionProps<'button'> & ComponentPropsWithoutRef<typeof MotionButton>
>((props, ref) => {
	return <MotionButton ref={ref} {...props} />;
});

Pressable.displayName = 'Pressable';

export { Pressable };
