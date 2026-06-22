'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Part } from '@dpm-core/api';
import {
	Button,
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	Input,
	toast,
	useAppShell,
} from '@dpm-core/shared';

import { updateAppleProfileMutationOptions } from '@/remotes/mutations/member';
import { getMyMemberInfoQuery, getNameHashTypeValidationQuery } from '@/remotes/queries/member';

import { useAppleProfileSetup } from '../_hooks/use-apple-profile-setup';
import { PartSelector } from './part-selector';

const MAX_NAME_LENGTH = 20;

/**
 * Apple 초기 가입자 프로필(이름/직군) 설정 바텀시트
 *
 * Apple 로그인 가입자의 name이 자동 생성값(이메일 local-part 또는 해시)인 경우,
 * 홈(`/`) 진입 시 자동으로 노출되어 이름과 직군을 입력받는다.
 * 운영진/멤버가 식별할 수 있도록 필수 설정이므로 외부 클릭/스와이프로 닫히지 않는다.
 */
export const AppleProfileSetupSheet = () => {
	const { isSetupRequired, memberName } = useAppleProfileSetup();
	const { ref } = useAppShell();
	const queryClient = useQueryClient();

	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState('');
	const [part, setPart] = useState<Part | null>(null);

	// 설정이 필요해지면 자동으로 바텀시트를 연다.
	useEffect(() => {
		if (isSetupRequired) {
			setIsOpen(true);
		}
	}, [isSetupRequired]);

	const { mutate: updateProfile, isPending } = useMutation(updateAppleProfileMutationOptions());

	const trimmedName = name.trim();
	const isValid = trimmedName.length > 0 && part !== null;

	const handleCancel = () => {
		setIsOpen(false);
	};

	const handleSubmit = () => {
		if (!isValid || part === null) return;

		updateProfile(
			{ name: trimmedName, part },
			{
				onSuccess: () => {
					// 이름/해시 검증 캐시를 무효화해 시트 재노출을 방지한다.
					queryClient.invalidateQueries({ queryKey: getMyMemberInfoQuery.queryKey });
					queryClient.invalidateQueries({
						queryKey: getNameHashTypeValidationQuery(memberName).queryKey,
					});
					setIsOpen(false);
					toast.success('프로필이 설정되었어요.');
				},
				onError: () => {
					toast.error('프로필 설정에 실패했어요. 다시 시도해주세요.');
				},
			},
		);
	};

	return (
		<Drawer open={isOpen} onOpenChange={setIsOpen} dismissible={false} container={ref.current}>
			<DrawerContent
				className="mx-auto pb-safe-area"
				style={{ maxWidth: ref.current?.clientWidth ?? 'auto' }}
			>
				<DrawerHeader showCloseButton={false}>
					<DrawerTitle className="font-semibold text-label-normal text-title2">
						활동에 필요한 정보를 입력해주세요.
					</DrawerTitle>
				</DrawerHeader>

				<div className="flex flex-col gap-6 px-6 py-4">
					<div className="flex flex-col gap-2">
						<div className="flex flex-col gap-1">
							<span className="font-semibold text-body1 text-label-normal">이름</span>
							<span className="text-body2 text-label-assistive">본명을 입력해주세요.</span>
						</div>
						<Input
							variant="line"
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="이름을 입력해주세요"
							maxLength={MAX_NAME_LENGTH}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<div className="flex flex-col gap-1">
							<span className="font-semibold text-body1 text-label-normal">파트</span>
							<span className="text-body2 text-label-assistive">
								디프만에서 활동 중인 파트를 선택해주세요.
							</span>
						</div>
						<PartSelector value={part} onChange={setPart} name="apple-profile-part" />
					</div>
				</div>

				<DrawerFooter>
					<Button
						variant="secondary"
						size="full"
						className="h-14 rounded-lg"
						onClick={handleSubmit}
						disabled={!isValid || isPending}
					>
						{isPending ? '저장 중...' : '저장'}
					</Button>
					<Button
						variant="assistive"
						size="full"
						className="h-14 rounded-lg"
						onClick={handleCancel}
						disabled={isPending}
					>
						취소
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
