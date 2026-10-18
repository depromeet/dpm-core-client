'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@dpm-core/shared';

import { AppHeader } from '@/components/app-header';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { memberAuthQueryKey } from '@/providers/auth-provider';
import { reapplyMembershipMutationOptions } from '@/remotes/mutations/member';

import { ProfileForm } from '../../profile/_components/profile-form';

/**
 * 반려 후 재신청한 회원이 지원 시 입력했던 개인정보(이름/직군)를 수정하는 화면.
 * 서버가 이름·파트 입력 완료를 재신청의 선행 조건으로 요구하므로, 저장이 끝난 뒤에 재신청한다.
 */
export default function RejectedEditPage() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { mutate: reapply } = useMutation(
		reapplyMembershipMutationOptions({
			onSuccess: async () => {
				// AuthProvider는 이 키로 승인 상태를 판단하므로, 무효화하지 않으면 바뀐 상태(PENDING)를
				// 모른 채 여전히 REJECTED로 보고 /rejected로 되돌려보낸다.
				await queryClient.invalidateQueries({ queryKey: memberAuthQueryKey });
				router.replace('/pending');
			},
			onError: () => toast.error('재신청에 실패했어요. 다시 시도해주세요.'),
		}),
	);

	return (
		<SafeAreaAppLayout className="h-dvh bg-background-normal">
			<AppHeader title="" />
			<ProfileForm onSubmitted={() => reapply()} alwaysEditable />
		</SafeAreaAppLayout>
	);
}
