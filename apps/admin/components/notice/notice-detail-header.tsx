'use client';

import type React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button, cn, Edit, IconButton, type Profile, ProfileStack } from '@dpm-core/shared';

export interface NoticeDetailHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	readProfiles?: Profile[];
	readCount?: number;
	onBack?: () => void;
	onEdit?: () => void;
	showEditButton?: boolean;
}

export const NoticeDetailHeader = ({
	className,
	title,
	readProfiles = [],
	readCount = 0,
	onBack,
	onEdit,
	showEditButton = true,
	...props
}: NoticeDetailHeaderProps) => {
	return (
		<div
			className={cn(
				'flex h-20 items-center gap-3 border-line-normal border-b bg-background-normal px-6',
				className,
			)}
			{...props}
		>
			<IconButton variant="ghost" size="md" onClick={onBack} aria-label="뒤로 가기">
				<ChevronLeft className="size-5" />
			</IconButton>
			<h1 className="flex-1 font-bold text-headline1 text-label-normal">{title}</h1>

			<div className="flex items-center gap-6">
				{readProfiles.length > 0 && (
					<div className="flex items-center gap-1">
						<ProfileStack profiles={readProfiles} max={3} showCount={false} />
						<p className="font-semibold text-body2 text-label-assistive">+{readCount}명 읽음</p>
					</div>
				)}

				{showEditButton && (
					<Button variant="secondary" size="lg" onClick={onEdit}>
						<Edit className="size-5" />
						수정하기
					</Button>
				)}
			</div>
		</div>
	);
};
