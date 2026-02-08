'use client';

import type React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@dpm-core/shared';

const noticeTagVariants = cva(
	'inline-flex items-center justify-center overflow-hidden rounded px-[5px] py-[3px] font-semibold text-caption1',
	{
		variants: {
			type: {
				default: 'bg-primary-extralight text-blue-400',
				assignment: 'bg-yellow-100 text-yellow-600',
				individual: 'bg-green-100 text-green-500',
				team: 'bg-green-100 text-green-500',
				etc: 'bg-gray-100 text-gray-600',
			},
		},
		defaultVariants: {
			type: 'default',
		},
	},
);

const labelMap: Record<string, string> = {
	default: '일반 공지',
	assignment: '과제 공지',
	individual: '개인 과제',
	team: '팀 과제',
	etc: '기타 공지',
};

export interface NoticeTagProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof noticeTagVariants> {
	label?: string;
}

export const NoticeTag = ({ className, type = 'default', label, ...props }: NoticeTagProps) => {
	const displayLabel = label || labelMap[type || 'default'];

	return (
		<div className={cn(noticeTagVariants({ type, className }))} {...props}>
			{displayLabel}
		</div>
	);
};
