import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';

import { ProfileForm } from '../../profile/_components/profile-form';

/**
 * 승인 대기 중인 회원이 제출했던 개인정보(이름/직군)를 다시 열어 수정하는 화면.
 * 저장하면 검토중 화면으로 돌아간다.
 */
export default function PendingEditPage() {
	return (
		<SafeAreaAppLayout className="h-dvh bg-background-normal">
			<AppHeader title="" />
			<ProfileForm alwaysEditable />
		</SafeAreaAppLayout>
	);
}
