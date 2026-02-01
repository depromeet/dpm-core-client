'use client';

import type React from 'react';

import { cn } from '../utils/cn';
import { Button } from './ui/button';

export interface MultiActionToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
	selectedCount: number;
	totalCount: number;
	actions?: Array<{
		label: string;
		onClick: () => void;
		disabled?: boolean;
	}>;
	active?: boolean;
}

export const MultiActionToolbar = ({
	className,
	selectedCount,
	totalCount,
	actions = [],
	active = true,
	...props
}: MultiActionToolbarProps) => {
	return (
		<div
			className={cn(
				'flex h-17.5 items-center gap-4 border-line-subtle border-t bg-background-normal py-3',
				className,
			)}
			{...props}
		>
			<p className="flex-1 font-medium text-body1 text-label-subtle">
				{active ? (
					<>
						<span className="text-primary-normal">{selectedCount}명</span> 선택됨
					</>
				) : (
					`전체 ${totalCount}명`
				)}
			</p>

			<div className="flex items-center gap-2">
				{actions.map(({ onClick, disabled, label }) => (
					<Button
						key={label}
						variant="secondary"
						size="md"
						onClick={onClick}
						disabled={!active || disabled}
					>
						{label}
					</Button>
				))}
			</div>
		</div>
	);
};
