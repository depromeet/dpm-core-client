import { AppLayout } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';

import { LoginEamilForm } from './_components/login-form';

export default function EmailLoginPage() {
	return (
		<AppLayout className="bg-background-normal">
			<AppHeader title="이메일 로그인" />
			<section className="px-4">
				<LoginEamilForm />
			</section>
		</AppLayout>
	);
}
