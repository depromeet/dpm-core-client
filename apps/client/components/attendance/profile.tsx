import type { Part } from '@dpm-core/api';
import { cn } from '@dpm-core/shared';
import Image from 'next/image';
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
	const { part: partProp, name, teamNumber, size = 40 } = props;

	const part = isExistPart(partProp) ? partProp : 'WEB';

	return (
		<div className="flex gap-4 items-center">
			<div className={cn('bg-background-strong rounded-full')}>
				<Image width={size} height={size} src={cohort[part].icon} alt={`${part}_프로필_이미지`} />
			</div>
			<div className="flex flex-col gap-0.5">
				<span className="text-body1 font-semibold">{name}</span>
				<div className="flex gap-1.5 text-caption1 text-label-assistive">
					<span>{teamNumber}팀</span>
					<span className="border border-line-subtle" />
					<span>{getMemberPartLabel(part)}</span>
				</div>
			</div>
		</div>
	);
};
