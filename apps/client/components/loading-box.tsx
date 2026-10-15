'use client';

import type { ComponentProps } from 'react';
import { cn } from '@dpm-core/shared';

import { Loading } from './lotties/loading';

type LoadingBoxProps = ComponentProps<'div'>;

const LoadingBox = (props: LoadingBoxProps) => {
	const { className, ...restProps } = props;

	return (
		<div
			className={cn('flex flex-1 flex-col items-center justify-center', className)}
			{...restProps}
		>
			<div className="aspect-375/212 max-w-93.75">
				<Loading />
			</div>
		</div>
	);
};

export { LoadingBox };
