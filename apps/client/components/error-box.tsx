'use client';

import type { ComponentProps } from 'react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
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
			<p className="text-body2 font-semibold">이런! 문제가 생겼어요.</p>
			<button type="button" onClick={onReset}>
				다시 시도
			</button>
		</div>
	);
};

const ErrorBoxFallback = ({ reset }: ErrorBoundaryFallbackProps) => <ErrorBox onReset={reset} />;

export { ErrorBox, ErrorBoxFallback };
