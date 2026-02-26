import type * as React from 'react';
import { cn } from '../utils/cn';

interface MemberProfileProps extends React.ComponentProps<'div'> {
	name: string;
	team: string;
	role: string;
}

export const MemberProfile = ({ name, team, role, className, ...props }: MemberProfileProps) => {
	return (
		<div className={cn('flex items-center gap-4 py-3', className)} {...props}>
			<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
				{/* Placeholder for avatar icon or image */}
				<div className="h-6 w-6 rounded-full bg-gray-200" />
			</div>
			<div className="flex flex-col gap-0.5">
				<span className="font-semibold text-body1 text-label-normal">{name}</span>
				<div className="flex items-center gap-1.5 text-caption1 text-label-assistive">
					<span>{team}</span>
					<span className="h-2 w-[1px] bg-gray-200" />
					<span>{role}</span>
				</div>
			</div>
		</div>
	);
};
