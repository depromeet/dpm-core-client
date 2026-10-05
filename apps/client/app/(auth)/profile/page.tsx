import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';

import { ProfileForm } from './_components/profile-form';

export default function ProfilePage() {
	return (
		<SafeAreaAppLayout className="bg-background-normal">
			<AppHeader title="" />
			<ProfileForm />
		</SafeAreaAppLayout>
	);
}
