'use client';

import type React from 'react';

import { cn } from '../utils/cn';

export interface ChipGroupProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
	label?: string;
	/** 칩이 나열되는 영역(간격 등)을 덮어쓸 때 사용한다. */
	contentClassName?: string;
}

export const ChipGroup = ({
	className,
	label,
	contentClassName,
	children,
	...props
}: ChipGroupProps) => {
	return (
		<fieldset className={cn('flex flex-col gap-2', className)} {...props}>
			{/* {label && <legend className="font-semibold text-body1 text-label-normal">{label}</legend>} */}
			<div className={cn('flex flex-wrap items-center gap-2', contentClassName)}>{children}</div>
		</fieldset>
	);
};
