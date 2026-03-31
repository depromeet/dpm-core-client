import Image from 'next/image';
import type { Part } from '@dpm-core/api';
import { cn } from '@dpm-core/shared';

import { cohort } from '@/constants/cohort';
import { getMemberPartLabel } from '@/lib/member/part';
import { isExistPart } from '@/lib/utils';

interface ProfileProps extends React.ComponentProps<'div'> {
	part: Part;
	name: string;
	teamNumber: number;
	isAdmin?: boolean;
	size?: number;
}

export const Profile = (props: ProfileProps) => {
	const { part, name, teamNumber, isAdmin = false, size = 40 } = props;

	const teamLabel = teamNumber === 0 ? '팀 미배정' : `${teamNumber}팀`;
	const partLabel = isExistPart(part) ? getMemberPartLabel(part) : '파트 미배정';

	const metaItems = [isAdmin && '운영진', teamLabel, partLabel].filter(Boolean);

	return (
		<div className="flex items-center gap-4">
			<div className={cn('rounded-full bg-background-strong')}>
				<Image
					width={size}
					height={size}
					src={isExistPart(part) ? cohort[part].icon : cohort.ETC.icon}
					alt={`${part}_프로필_이미지`}
				/>
			</div>
			<div className="flex flex-col gap-0.5">
				<span className="font-semibold text-body1">{name}</span>
				<div className="flex flex-wrap gap-1.5 font-medium text-caption1 text-label-assistive">
					{metaItems.map((item, idx) => (
						<div key={`${item}`} className="flex items-center gap-1.5">
							{idx !== 0 && <span className="h-3.5 w-px bg-line-subtle" />}
							<span>{item}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
