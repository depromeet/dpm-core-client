import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';

import { ProfileBackButton } from './_components/profile-back-button';
import { ProfileForm } from './_components/profile-form';

export default function ProfilePage() {
	return (
		<SafeAreaAppLayout className="h-dvh bg-background-normal">
			<AppHeader title="" leftIcon={<ProfileBackButton />} />
			<ProfileForm />
		</SafeAreaAppLayout>
	);
}
