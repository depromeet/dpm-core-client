'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
	Button,
	CircleCheck,
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	useAppShell,
} from '@dpm-core/shared';

import { submitRsvpStatusMutationOptions } from '@/remotes/mutations/gathering-v2';

import type { AttendanceStatus } from '../_types/staff-dinner';
import { toRsvpGoing } from '../_types/staff-dinner';

interface StaffDinnerSubmitButtonProps {
	attendance: AttendanceStatus;
	dinnerTitle: string;
	gatheringId: number;
	onSubmitSuccess: () => void;
}

export const StaffDinnerSubmitButton = ({
	attendance,
	dinnerTitle,
	gatheringId,
	onSubmitSuccess,
}: StaffDinnerSubmitButtonProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const { ref } = useAppShell();

	const { mutate, isPending } = useMutation(
		submitRsvpStatusMutationOptions(gatheringId),
	);

	const handleSubmit = () => {
		if (attendance === null) return;

		mutate(
			{ isRsvpGoing: toRsvpGoing(attendance) },
			{
				onSuccess: () => {
					setIsOpen(false);
					onSubmitSuccess();
				},
			},
		);
	};

	const attendanceLabel = attendance === 'attending' ? '참석' : '불참';

	return (
		<section className="mt-auto px-4 pt-4 pb-4">
			<Drawer open={isOpen} onOpenChange={setIsOpen} container={ref.current}>
				<DrawerTrigger asChild>
					<Button
						variant="secondary"
						size="full"
						className="h-14 rounded-lg"
						disabled={attendance === null}
					>
						참석 여부 제출하기
					</Button>
				</DrawerTrigger>
				<DrawerContent
					className="mx-auto"
					style={{ maxWidth: ref.current?.clientWidth ?? 'auto' }}
				>
					<DrawerHeader>
						<DrawerTitle className="font-semibold text-label-normal text-title2">
							참석 여부 제출 전 확인
						</DrawerTitle>
					</DrawerHeader>

					<div className="flex flex-col gap-4 px-6 py-4">
						<h3 className="font-semibold text-body1 text-label-normal">{dinnerTitle}</h3>

						<div className="flex items-center gap-4 rounded-lg border border-line-normal bg-background-subtle px-4 py-3">
							<span className="block w-[70px] font-semibold text-body2 text-label-assistive">
								회식
							</span>
							<div className="flex items-center gap-1">
								<CircleCheck size={16} />
								<span className="flex items-center gap-1 font-medium text-body2 text-label-subtle">
									{attendanceLabel}
								</span>
							</div>
						</div>

						<p className="font-medium text-body2 text-label-subtle">
							참석 여부는 모든 디퍼에게 공개돼요.
							<br />
							원활한 회식 진행을 위해, 제출 전 한 번 더 확인해 주세요.
						</p>
					</div>

					<DrawerFooter>
						<Button
							variant="secondary"
							size="full"
							className="h-14 rounded-lg"
							onClick={handleSubmit}
							disabled={isPending}
						>
							{isPending ? '제출 중...' : '제출하기'}
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</section>
	);
};
