import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';

import { ProfileForm } from '../../profile/_components/profile-form';

/** 반려 후 재신청한 회원이 지원 시 입력했던 개인정보(이름/직군)를 수정하는 화면 */
export default function RejectedEditPage() {
	return (
		<SafeAreaAppLayout className="h-dvh bg-background-normal">
			<AppHeader title="" />
			<ProfileForm />
		</SafeAreaAppLayout>
	);
}
