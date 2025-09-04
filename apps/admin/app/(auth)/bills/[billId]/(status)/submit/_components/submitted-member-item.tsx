import type { Part } from '@dpm-core/api';
import { Profile } from '@/components/attendance/profile';

interface SubmittedMemberItemProps {
	member: {
		name: string;
		teamNumber: number;
		authority: string;
		part: Exclude<Part, 'ETC'>;
		isInvitationSubmitted: boolean;
	};
}

export const SubmittedMemberItem = ({ member }: SubmittedMemberItemProps) => {
	return (
		<div className="flex items-center justify-between">
			<Profile name={member.name} teamNumber={member.teamNumber} part={member.part} />
		</div>
	);
};
