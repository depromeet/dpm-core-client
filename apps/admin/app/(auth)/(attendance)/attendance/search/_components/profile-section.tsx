import { Profile } from '@/components/attendance/profile';

interface ProfileSectionProps {
	name: string;
	part: 'WEB' | 'ANDROID' | 'IOS' | 'DESIGN' | 'SERVER';
	teamNumber: number;
	isAdmin: boolean;
}

export const ProfileSection = ({ name, part, teamNumber, isAdmin }: ProfileSectionProps) => {
	return (
		<section className="mb-6">
			<Profile size={60} name={name} part={part} teamNumber={teamNumber} isAdmin={isAdmin} />
		</section>
	);
};
