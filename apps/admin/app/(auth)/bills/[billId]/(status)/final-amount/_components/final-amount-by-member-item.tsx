import type { Part } from '@dpm-core/api';
import { Profile } from '@/components/attendance/profile';
import { formatPrice } from '../../../utils/formatPrice';

interface FinalAmountByMemberItemProps {
	member: {
		name: string;
		teamNumber: number;
		authority: string;
		part: Exclude<Part, 'ETC'>;
		splitAmount: number;
	};
}
export const FinalAmountByMemberItem = ({ member }: FinalAmountByMemberItemProps) => {
	return (
		<div className="flex items-center justify-between">
			<Profile name={member.name} teamNumber={member.teamNumber} part={member.part} />
			<p className="flex gap-1 text-body2 font-semibold">
				<span className="text-label-normal">{formatPrice(member.splitAmount)}</span>
				<span className="text-label-assistive">원</span>
			</p>
		</div>
	);
};
