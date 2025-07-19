import { cn } from '@dpm-core/shared';
import type { ComponentPropsWithoutRef } from 'react';

type MypPageBoxProps = ComponentPropsWithoutRef<'div'>;

function MypPageBox(props: MypPageBoxProps) {
	return (
		<div
			{...props}
			className={cn(
				'rounded-lg bg-background-normal border border-line-subtle p-5 flex flex-col gap-y-5',
				props.className,
			)}
		/>
	);
}

export { MypPageBox };
