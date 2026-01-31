'use client';

import type React from 'react';

import { cn } from '../utils/cn';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export interface Profile {
	id: string;
	name: string;
	avatarSrc?: string;
	avatarFallback?: string;
}

export interface ProfileStackProps extends React.HTMLAttributes<HTMLDivElement> {
	profiles: Profile[];
	max?: number;
	showCount?: boolean;
}

export const ProfileStack = ({
	className,
	profiles,
	max = 3,
	showCount = true,
	...props
}: ProfileStackProps) => {
	const displayProfiles = profiles.slice(0, max);
	const remaining = profiles.length - max;

	return (
		<div className={cn('flex items-center gap-1', className)} {...props}>
			<div className="flex items-center pr-5">
				{displayProfiles.map(({ id, avatarSrc, name, avatarFallback }, index) => (
					<Avatar key={id} className={cn('size-10 border-2 border-white', index > 0 && '-ml-5')}>
						{avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}
						<AvatarFallback className="bg-primary-extralight text-primary-normal">
							{avatarFallback || name.charAt(0)}
						</AvatarFallback>
					</Avatar>
				))}
			</div>

			{showCount && remaining > 0 && (
				<p className="font-semibold text-body2 text-label-assistive">+{remaining}명 읽음</p>
			)}
		</div>
	);
};
