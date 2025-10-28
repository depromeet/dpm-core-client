import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@dpm-core/shared';

type MypPageBoxProps = ComponentPropsWithoutRef<'div'>;

function MypPageBox(props: MypPageBoxProps) {
	return (
		<div
			{...props}
			className={cn(
				'flex flex-col gap-y-5 rounded-lg border border-line-subtle bg-background-normal p-5',
				props.className,
			)}
		/>
	);
}

export { MypPageBox };
