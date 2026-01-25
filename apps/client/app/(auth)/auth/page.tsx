import { AppLayout } from '@dpm-core/shared';

import { SignupForm } from './_components/signup-form';
import { SignupHeader } from './_components/signup-header';

export default function SignupPage() {
	return (
		<AppLayout className="bg-background-normal px-4 pt-8">
			<SignupHeader />
			<SignupForm />
		</AppLayout>
	);
}
