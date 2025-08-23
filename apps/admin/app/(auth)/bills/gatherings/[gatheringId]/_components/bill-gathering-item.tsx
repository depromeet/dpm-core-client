import type { Part } from '@dpm-core/api';
import { Badge, CircleCheck, CircleX } from '@dpm-core/shared';
import { Profile } from '@/components/attendance/profile';

interface BillGatheringItemProps {
	member: {
		name: string;
		authority: string;
		part: Exclude<Part, 'ETC'>;
		teamNumber: number;
		isJoined: boolean;
	};
}

export const BillGatheringItem = ({ member }: BillGatheringItemProps) => {
	return (
		<div className="flex items-center justify-between">
			<Profile name={member.name} teamNumber={member.teamNumber} part={member.part} />
			<GatheringStatusBadge isJoined={member.isJoined} />
		</div>
	);
};

interface GatheringStatusBadgeProps {
	isJoined: boolean;
}

const GatheringStatusBadge = ({ isJoined }: GatheringStatusBadgeProps) => {
	return (
		<Badge className="p-0 gap-0.5 text-body2 font-semibold text-label-subtle">
			{isJoined ? (
				<>
					<CircleCheck color="#5E83FE" size={16} />
					<span>참석함</span>
				</>
			) : (
				<>
					<CircleX color="#FF7070" size={16} />
					<span>참석 안함</span>
				</>
			)}
		</Badge>
	);
};
