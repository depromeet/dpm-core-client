'use client';

import type React from 'react';

import { cn } from '../utils/cn';

export interface RadioListItemProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
	title: string;
	description: string;
	onDelete?: () => void;
	checked?: boolean;
}

export const RadioListItem = ({
	className,
	value,
	title,
	description,
	onDelete,
	checked = false,
	...props
}: RadioListItemProps) => {
	return (
		<div
			className={cn('flex items-start gap-4', className)}
			role="option"
			aria-selected={checked}
			data-value={value}
			tabIndex={0}
			{...props}
		>
			{/* Radio Button */}
			<div className="flex items-center py-1.5">
				<div
					className={cn(
						'flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
						checked
							? 'border-primary-normal bg-primary-normal'
							: 'border-line-normal bg-background-normal',
					)}
				>
					{checked && <div className="size-1.5 rounded-full bg-white" />}
				</div>
			</div>

			{/* Content */}
			<div className="flex flex-1 flex-col gap-0.5">
				<p className="line-clamp-1 font-semibold text-body1 text-label-normal">{title}</p>
				<p className="text-caption1 text-label-assistive">{description}</p>
			</div>

			{/* Delete Button */}
			{onDelete && (
				<button
					type="button"
					onClick={onDelete}
					className="font-semibold text-body2 text-red-500 transition-colors hover:text-red-600"
				>
					삭제
				</button>
			)}
		</div>
	);
};
