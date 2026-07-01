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
	// 모바일에서 키보드가 올라오면 저장/취소 버튼이 키보드에 밀려 어색하게 겹쳐 보이고,
	// 콘텐츠(제목+이름+파트)가 키보드 위 공간보다 커서 상단(입력창)이 잘리거나 가려진다.
	// → 키보드가 뜨면 버튼을 숨기고, 드로어를 키보드 위 가용 공간에 꽉 채운 뒤 내부 스크롤로
	//   포커스된 입력창이 항상 보이게 한다.
	// 포커스(onFocus/onBlur)는 iOS에서 Vaul과 타이밍이 꼬여 불안정하므로 visualViewport 로 직접 감지한다.
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	// 키보드 위로 확보되는 가용 높이(=visualViewport 높이).
	const [viewportHeight, setViewportHeight] = useState(0);
	// 브라우저 UI 변동으로 인한 오탐을 피하기 위해 임계값(150px)을 둔다.
	const isKeyboardOpen = keyboardHeight > 150;

	useEffect(() => {
		const viewport = window.visualViewport;
		if (!viewport) return;

		const handleViewportResize = () => {
			// 키보드가 올라오면 visualViewport 높이가 레이아웃 뷰포트보다 크게 줄어든다.
			setKeyboardHeight(Math.max(0, window.innerHeight - viewport.height));
			setViewportHeight(viewport.height);
		};

		viewport.addEventListener('resize', handleViewportResize);
		handleViewportResize();

		return () => viewport.removeEventListener('resize', handleViewportResize);
	}, []);

	// iOS Safari는 인풋 포커스 시 문서를 간헐적으로 스크롤해, position:fixed 인 드로어까지
	// 시각적으로 위로 밀어버린다(입력창이 잘리고 키보드와 시트 사이 빈 공간 발생).
	// 키보드가 떠 있는 동안 window 스크롤을 상단에 고정해 이 밀림을 막는다.
	useEffect(() => {
		if (!isKeyboardOpen) return;

		const lockScrollToTop = () => window.scrollTo(0, 0);
		lockScrollToTop();
		window.addEventListener('scroll', lockScrollToTop);

		return () => window.removeEventListener('scroll', lockScrollToTop);
	}, [isKeyboardOpen]);

	// 설정이 필요해지면 자동으로 바텀시트를 연다.
	// 사용자가 바텀시트가 왜 떴는지 헷갈리지 않도록 안내 토스트를 함께 노출한다.
	useEffect(() => {
		if (isSetupRequired) {
			setIsOpen(true);
			toast.info('원활한 활동을 위해 이름과 직군 설정이 필요해요.');
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
		<Drawer
			open={isOpen}
			onOpenChange={setIsOpen}
			dismissible={false}
			container={ref.current}
			// Vaul 기본 키보드 리포지셔닝은 콘텐츠가 클 때 드로어를 과하게 밀어올려 입력창이 잘리므로 끄고,
			// 아래에서 드로어를 키보드 위 공간에 직접 맞춘다.
			repositionInputs={false}
		>
			<DrawerContent
				className={`mx-auto pb-safe-area ${isKeyboardOpen ? 'overflow-y-auto' : ''}`}
				style={{
					maxWidth: ref.current?.clientWidth ?? 'auto',
					// 키보드가 떠 있는 동안: 드로어 바닥을 키보드 바로 위에 두고(bottom),
					// 높이를 키보드 위 가용 공간으로 고정해(height) 꽉 채운다. 넘치는 내용은 내부 스크롤되며
					// 포커스된 입력창은 브라우저가 자동으로 스크롤해 보여준다.
					...(isKeyboardOpen
						? { bottom: keyboardHeight, height: viewportHeight, maxHeight: viewportHeight }
						: {}),
				}}
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

				{!isKeyboardOpen && (
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
				)}
			</DrawerContent>
		</Drawer>
	);
};
