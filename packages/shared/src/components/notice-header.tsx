'use client';

import type React from 'react';
import { cn } from '../utils/cn';

export interface NoticeHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
}

export const NoticeHeader = ({ className, title, ...props }: NoticeHeaderProps) => {
	return (
		<div
			className={cn(
				'flex h-20 items-center justify-between border-b border-line-normal bg-background-normal px-10',
				className,
			)}
			{...props}
		>
			<h1 className="flex-1 font-bold text-headline1 text-label-normal">{title}</h1>
		</div>
	);
};
