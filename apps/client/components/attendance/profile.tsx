import { Avatar, cn } from '@dpm-core/shared';
import Image from 'next/image';
import { cohort } from '@/constants/cohort';
import { isExistPart } from '@/lib/utils';

type Part = 'WEB' | 'ANDROID' | 'IOS' | 'DESIGN' | 'SERVER';

interface ProfileProps extends React.ComponentProps<'div'> {
	part?: Part;
	name?: string;
	teamNumber?: number;
	size?: number;
}

export const Profile = (props: ProfileProps) => {
	const { part, name, teamNumber, size = 32 } = props;

	return (
		<div className="flex gap-4 items-center">
			<div className="flex flex-col gap-0.5">
				<span className="text-body1 font-semibold">{name}</span>
				<div className="flex gap-3.5 text-caption1 text-label-assistive">
					<span>{teamNumber}조</span>
					<span>{part}</span>
				</div>
			</div>
			<Avatar className={cn('bg-background-strong size-15 p-1.5')}>
				<Image
					width={size}
					height={size}
					src={isExistPart(part) ? cohort[part] : cohort.WEB}
					alt={`${part}_프로필_이미지`}
				/>
			</Avatar>
		</div>
	);
};
