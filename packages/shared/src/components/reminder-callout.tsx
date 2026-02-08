'use client';

import type React from 'react';
import { Bell } from 'lucide-react';

import { cn } from '../utils/cn';

export interface ReminderCalloutProps extends React.HTMLAttributes<HTMLDivElement> {
	title?: string;
	description?: string;
}

export const ReminderCallout = ({
	className,
	title = '리마인드 알림 일괄 전송',
	description = '아직 읽지 않은 디퍼들에게 리마인드 알림을 일괄 전송합니다.',
	...props
}: ReminderCalloutProps) => {
	return (
		<div
			className={cn('flex flex-col gap-0 rounded-lg bg-background-strong p-4', className)}
			{...props}
		>
			<div className="flex items-center gap-2">
				<Bell className="size-5 text-label-normal" />
				<h4 className="font-medium text-body1 text-label-strong">{title}</h4>
			</div>
			<div className="flex items-center pl-7">
				<p className="font-medium text-body2 text-label-subtle">{description}</p>
			</div>
		</div>
	);
};
