'use client';

import { cn } from '../utils/cn';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export interface SubjectChip {
	id: number | string;
	name: string;
	imageSrc?: string;
}

export interface SubjectChipListProps {
	subjects: SubjectChip[];
	className?: string;
}

/**
 * 작업 대상이 누구인지 보여주는 프로필 칩 목록.
 * 대상이 많아도 모달이 늘어나지 않도록 높이를 제한하고 안에서만 스크롤한다.
 */
export const SubjectChipList = ({ subjects, className }: SubjectChipListProps) => {
	return (
		<ul className={cn('flex max-h-45 flex-wrap gap-2 overflow-y-auto', className)}>
			{subjects.map(({ id, name, imageSrc }) => (
				<li
					key={id}
					className="flex h-8 items-center gap-1.5 rounded-full border border-line-subtle py-1 pr-3 pl-1"
				>
					<Avatar className="size-6 shrink-0">
						{imageSrc && <AvatarImage src={imageSrc} alt="" />}
						<AvatarFallback className="bg-primary-extralight text-caption1 text-primary-normal">
							{name.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<span className="font-medium text-body2 text-label-normal">{name}</span>
				</li>
			))}
		</ul>
	);
};
