import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@dpm-core/shared';

type MyPageBoxProps = ComponentPropsWithoutRef<'div'>;

function MyPageBox(props: MyPageBoxProps) {
	return <div {...props} className={cn('rounded-lg bg-white p-5', props.className)} />;
}

export { MyPageBox };
