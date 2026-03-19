import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';

import { LoginEamilForm } from './_components/login-form';

export default function EmailLoginPage() {
	return (
		<SafeAreaAppLayout className="bg-background-normal pb-safe-area">
			<AppHeader title="이메일 로그인" />
			<section className="px-4">
				<LoginEamilForm />
			</section>
		</SafeAreaAppLayout>
	);
}
