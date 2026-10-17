'use client';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';

import { SignupForm } from '@/app/(auth)/auth/_components/signup-form';
import { SignupHeader } from '@/app/(auth)/auth/_components/signup-header';
import { SafeAreaAppLayout } from '@/components/app-layout';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';

/** 반려 후 재신청한 회원이 지원 시 입력했던 개인정보(이름/이메일)를 수정하는 화면 */
export default function RejectedEditPage() {
	const { data } = useQuery(getMyMemberInfoQuery);
	const memberInfo = data?.data;

	return (
		<SafeAreaAppLayout className="h-dvh bg-background-normal px-4 pt-8">
			<Suspense>
				<SignupHeader />
			</Suspense>
			<SignupForm
				defaultValues={{
					name: memberInfo?.name ?? '',
					signupEmail: memberInfo?.email ?? '',
				}}
			/>
		</SafeAreaAppLayout>
	);
}
