import Image from 'next/image';
import type { Part } from '@dpm-core/api';
import { cn } from '@dpm-core/shared';

import { cohort } from '@/constants/cohort';
import { getMemberPartLabel } from '@/lib/member/part';
import { isExistPart } from '@/lib/utils';

interface ProfileProps extends React.ComponentProps<'div'> {
	part: Exclude<Part, 'ETC'>;
	name: string;
	teamNumber: number;
	size?: number;
}

export const Profile = (props: ProfileProps) => {
	const { part, name, teamNumber, size = 40 } = props;

	return (
		<div className="flex items-center gap-4">
			<div className={cn('rounded-full bg-background-strong')}>
				<Image
					width={size}
					height={size}
					src={isExistPart(part) ? cohort[part] : cohort.WEB}
					alt={`${part}_프로필_이미지`}
				/>
			</div>
			<div className="flex flex-col gap-0.5">
				<span className="font-semibold text-body1">{name}</span>
				<div className="flex gap-1.5 text-caption1 text-label-assistive">
					<span>{teamNumber}팀</span>
					<span className="border-line-subtle border-l" />
					<span>{getMemberPartLabel(part)}</span>
				</div>
			</div>
		</div>
	);
};
