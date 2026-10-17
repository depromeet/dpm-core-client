'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@dpm-core/shared';

import { Pressable } from '@/components/motion';

/**
 * 이미 카카오톡으로 가입한 회원이 애플로 가입정보를 입력했을 때 띄우는 모달
 * TODO: 중복 가입 여부를 알려주는 API 연동 후 ProfileForm 에서 연결한다.
 */
export const DuplicateAccountModal = ({ open }: { open: boolean }) => {
	const router = useRouter();

	return (
		<Dialog open={open}>
			<DialogContent showCloseButton={false}>
				<DialogTitle className="sr-only">이미 카카오톡으로 가입된 계정이에요.</DialogTitle>
				<DialogHeader className="break-keep text-left font-bold text-title1 tracking-[-0.2px]">
					이미 카카오톡으로 가입된 계정이에요.
				</DialogHeader>
				<DialogFooter>
					<Pressable
						className="flex-1"
						variant="secondary"
						size="lg"
						onClick={() => router.replace('/login')}
					>
						로그인 화면으로
					</Pressable>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
