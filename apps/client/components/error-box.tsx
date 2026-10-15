'use client';

import type { ComponentProps } from 'react';
import { cn } from '@dpm-core/shared';

interface ErrorBoxProps extends ComponentProps<'div'> {
	onReset?: () => void;
}

const ErrorBox = (props: ErrorBoxProps) => {
	const { className, onReset, ...restProps } = props;

	return (
		<div
			className={cn('flex h-full flex-col items-center justify-center', className)}
			{...restProps}
		>
			<p className="font-semibold text-body2">이런! 문제가 생겼어요.</p>
			<button type="button" onClick={onReset}>
				다시 시도
			</button>
		</div>
	);
};

export { ErrorBox };
