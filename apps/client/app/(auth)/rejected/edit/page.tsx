'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, Member } from '@dpm-core/api';
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
				// 재신청 성공 시 상태는 확정적으로 PENDING이므로, 네트워크 응답을 기다리지 않고
				// 캐시를 먼저 PENDING으로 맞춘다. 다만 setQueryData 는 구독자(AuthProvider)에게
				// 비동기로(다음 틱에) 알림이 가므로, 바로 이어서 router.replace 를 호출하면 그
				// 알림이 반영되기 전에 네비게이션이 먼저 커밋돼 AuthProvider가 그 순간 여전히
				// REJECTED로 읽고 /rejected로 되돌려보낼 수 있다. 한 틱을 확실히 양보해
				// AuthProvider가 PENDING으로 리렌더링을 마친 뒤에 이동한다.
				queryClient.setQueryData(
					memberAuthQueryKey,
					(old: ApiResponse<Member> | undefined) =>
						old && { ...old, data: { ...old.data, status: 'PENDING' as const } },
				);
				await new Promise((resolve) => setTimeout(resolve, 0));
				router.replace('/pending');
				await queryClient.invalidateQueries({ queryKey: memberAuthQueryKey });
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
