'use client';

import type React from 'react';

import { cn } from '../utils/cn';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export interface MemberProfileProps extends React.HTMLAttributes<HTMLDivElement> {
	name: string;
	team?: string;
	role?: string;
	avatarSrc?: string;
	avatarFallback?: string;
	showHover?: boolean;
}

export const MemberProfile = ({
	className,
	name,
	team,
	role,
	avatarSrc,
	avatarFallback,
	showHover = false,
	...props
}: MemberProfileProps) => {
	return (
		<div
			className={cn(
				'flex items-center gap-3 rounded-lg bg-background-normal p-2',
				showHover && 'hover:bg-background-hover',
				className,
			)}
			{...props}
		>
			<Avatar className="size-10 shrink-0">
				{avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}
				<AvatarFallback className="bg-primary-extralight text-primary-normal">
					{avatarFallback || name.charAt(0)}
				</AvatarFallback>
			</Avatar>

			<div className="flex flex-col gap-0.75">
				<p className="font-semibold text-caption1 text-label-normal">{name}</p>
				{(team || role) && (
					<div className="flex items-center gap-1.5 text-body2 text-label-assistive">
						{team && <span>{team}</span>}
						{team && role && <div className="h-4 w-px bg-gray-500" />}
						{role && <span>{role}</span>}
					</div>
				)}
			</div>
		</div>
	);
};
