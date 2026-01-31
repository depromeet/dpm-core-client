'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import {
	Button,
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@dpm-core/shared';

interface ReviewDrawerProps {
	children: React.ReactNode;
	data: {
		title: string;
		description?: string;
		scheduledAt?: Date;
		closedAt?: Date;
		inviteScopes: string[];
	};
	/** 초대 범위 옵션 (id -> label 매핑용) */
	inviteScopeOptions: { id: string; label: string }[];
	onConfirm: () => void;
}

dayjs.locale('ko');

/** 날짜 포맷: 25년 00월 00일 (토) */
const formatDateWithDay = (date: Date) => {
	return dayjs(date).format('YY년 MM월 DD일 (ddd)');
};

/** 날짜+시간 포맷: 25년 00월 00일 (토) 오전 00시 까지 */
const formatDateTimeWithDay = (date: Date) => {
	return dayjs(date).format('YY년 MM월 DD일 (ddd) A h시 까지');
};

export const ReviewDrawer = ({
	children,
	data,
	inviteScopeOptions,
	onConfirm,
}: ReviewDrawerProps) => {
	const { title, description, scheduledAt, closedAt, inviteScopes } = data;

	// id를 label로 변환
	const scopeLabels = inviteScopes
		.map((id) => {
			const option = inviteScopeOptions.find((opt) => opt.id === id);
			return option ? `@${option.label}` : null;
		})
		.filter(Boolean);

	return (
		<Drawer modal={false}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent
				aria-describedby={undefined}
				className="mx-auto flex max-h-[90vh] max-w-lg flex-col"
			>
				<DrawerHeader showCloseButton className="shrink-0 px-5 pt-5 pb-4 text-left">
					<DrawerTitle className="font-semibold text-[#1F2937] text-[18px] leading-[144%]">
						검토하기
					</DrawerTitle>
				</DrawerHeader>

				<div className="flex-1 overflow-y-auto px-5">
					{/* 회식 정보 카드 */}
					<div className="rounded-lg bg-[#F6F8FA] p-4">
						{/* 회식 이름 */}
						<h3 className="font-semibold text-[#4B5563] text-[16px] leading-[150%]">
							{title || '회식 이름'}
						</h3>

						{/* 회식 설명 */}
						{description && (
							<p className="mt-1 font-medium text-[#9CA3AF] text-[14px] leading-[142%]">
								{description}
							</p>
						)}

						{/* 상세 정보 */}
						<div className="mt-4 space-y-3">
							{/* 회식 날짜 */}
							<div className="flex gap-4">
								<span className="w-[70px] shrink-0 font-semibold text-[#9CA3AF] text-[14px] leading-[142%]">
									회식 날짜
								</span>
								<span className="font-medium text-[#4B5563] text-[14px] leading-[142%]">
									{scheduledAt ? formatDateWithDay(scheduledAt) : '-'}
								</span>
							</div>

							{/* 조사 기한 */}
							<div className="flex gap-4">
								<span className="w-[70px] shrink-0 font-semibold text-[#9CA3AF] text-[14px] leading-[142%]">
									조사 기한
								</span>
								<span className="font-medium text-[#4B5563] text-[14px] leading-[142%]">
									{closedAt ? formatDateTimeWithDay(closedAt) : '-'}
								</span>
							</div>

							{/* 초대 범위 */}
							<div className="flex gap-4">
								<span className="w-[70px] shrink-0 font-semibold text-[#9CA3AF] text-[14px] leading-[142%]">
									초대 범위
								</span>
								<div className="flex flex-wrap gap-1">
									{scopeLabels.length > 0 ? (
										scopeLabels.map((label) => (
											<span
												key={label}
												className="rounded bg-[#F3F4F6] px-[5px] py-[3px] font-semibold text-[12px] leading-[133%]"
											>
												<span className="text-[#9CA3AF]">@</span>
												<span className="text-[#6B7280]">{label?.slice(1)}</span>
											</span>
										))
									) : (
										<span className="font-medium text-[#4B5563] text-[14px] leading-[142%]">-</span>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* 안내 문구 */}
					<p className="mt-4 font-medium text-[#4B5563] text-[14px] leading-[142%]">
						회식을 생성하면 디퍼들에게 참여 조사가 발송돼요.
						<br />
						생성 후에는 수정할 수 없으니, 제출 전 한 번 더 확인해 주세요.
					</p>
				</div>

				<DrawerFooter className="shrink-0 gap-3 px-5 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
					<div className="flex gap-3">
						<DrawerTrigger asChild>
							<Button
								variant="none"
								size="full"
								className="h-[48px] flex-1 rounded-lg bg-[#F3F4F6] font-semibold text-[#1F2937] text-[16px] leading-[150%] hover:bg-[#E5E7EB]"
							>
								수정하기
							</Button>
						</DrawerTrigger>
						<Button
							variant="secondary"
							size="full"
							className="h-[48px] flex-1 rounded-lg bg-[#1F2937] font-semibold text-[16px] text-white leading-[150%] hover:bg-[#1F2937]/90"
							onClick={onConfirm}
						>
							생성하기
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
