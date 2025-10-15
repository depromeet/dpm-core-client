'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { HTMLMotionProps } from 'motion/react';

import { MotionButton } from './foundation';

const Pressable = forwardRef<
	HTMLButtonElement,
	HTMLMotionProps<'button'> & ComponentPropsWithoutRef<typeof MotionButton>
>((props, ref) => {
	return <MotionButton ref={ref} {...props} />;
});

Pressable.displayName = 'Pressable';

export { Pressable };
