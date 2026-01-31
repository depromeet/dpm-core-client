'use client';

import type React from 'react';

import { cn } from '../utils/cn';

export interface Tab {
	id: string;
	label: string;
}

export interface TeamTabBarProps extends React.HTMLAttributes<HTMLDivElement> {
	tabs: Tab[];
	activeTabId: string;
	onTabChange?: (tabId: string) => void;
}

export const TeamTabBar = ({
	className,
	tabs,
	activeTabId,
	onTabChange,
	...props
}: TeamTabBarProps) => {
	return (
		<div
			className={cn(
				'flex h-full items-end border-line-normal border-b bg-background-normal pt-3',
				className,
			)}
			{...props}
		>
			<div className="flex items-center">
				{tabs.map(({ id, label }) => {
					const isActive = id === activeTabId;

					return (
						<button
							key={id}
							type="button"
							onClick={() => onTabChange?.(id)}
							className={cn(
								'relative flex flex-col items-center justify-end pt-1 pb-3',
								'transition-colors',
							)}
						>
							<div
								className={cn(
									'rounded-lg px-3 py-1 font-semibold text-title2',
									isActive
										? 'bg-background-normal text-label-strong'
										: 'text-label-assistive hover:bg-background-strong',
								)}
							>
								{label}
							</div>

							{isActive && (
								<div className="absolute right-0 bottom-0 left-0 h-0.5 bg-label-strong" />
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
};
