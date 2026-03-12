'use client';

import type React from 'react';
import { cn, NoticeTag } from '@dpm-core/shared';

export interface NoticeCardProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	date: string;
	readCount: number;
	tags?: Array<'default' | 'assignment' | 'individual' | 'team' | 'etc'>;
}

export const NoticeCard = ({
	className,
	title,
	date,
	readCount,
	tags = [],
	onClick,
	...props
}: NoticeCardProps) => {
	return (
		<div
			className={cn('flex w-full flex-col gap-2', onClick && 'cursor-pointer', className)}
			role={onClick ? 'button' : undefined}
			tabIndex={onClick ? 0 : undefined}
			onKeyDown={
				onClick
					? (e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
							}
						}
					: undefined
			}
			onClick={onClick}
			{...props}
		>
			{tags.length > 0 && (
				<div className="flex flex-wrap items-start gap-2">
					{tags.map((tag) => (
						<NoticeTag key={tag} type={tag} />
					))}
				</div>
			)}
			<div className="flex flex-col gap-2">
				<p className="line-clamp-2 font-semibold text-body1 text-label-normal">{title}</p>
				<div className="flex items-center gap-1 text-caption1 text-label-assistive">
					<span>{date}</span>
					<div className="h-3 w-px bg-gray-400" />
					<span>{readCount}명 읽음</span>
				</div>
			</div>
		</div>
	);
};
