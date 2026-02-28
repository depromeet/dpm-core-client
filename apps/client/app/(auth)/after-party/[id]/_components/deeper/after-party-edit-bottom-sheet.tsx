'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Button,
	cn,
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	useAppShell,
} from '@dpm-core/shared';

import { submitAttendanceStatusMutationOptions } from '@/remotes/mutations/after-party';
import {
	getAfterPartyByIdQueryOptions,
	getAfterPartyInvitedMembersQueryOptions,
} from '@/remotes/queries/after-party';

import FaceDissapointed from '../../_assets/face-dissapointed.png';
import FaceGlasses from '../../_assets/face-glasses.png';
import { type AttendanceStatus, toAttendanceResponse } from '../../_types/after-party-survey';
import { AttendanceSelector } from './attendance-selector';

interface AfterPartyEditBottomSheetProps {
	attendance: AttendanceStatus;
	onEditSuccess: (newAttendance: AttendanceStatus) => void;
	children: React.ReactNode;
	isClosed?: boolean;
	gatheringId: number;
}

export const AfterPartyEditBottomSheet = ({
	attendance,
	onEditSuccess,
	children,
	isClosed = false,
	gatheringId,
}: AfterPartyEditBottomSheetProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedAttendance, setSelectedAttendance] = useState<AttendanceStatus>(attendance);
	const { ref } = useAppShell();
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation(submitAttendanceStatusMutationOptions(gatheringId));

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (open) {
			setSelectedAttendance(attendance);
		}
	};

	const handleSubmit = () => {
		if (selectedAttendance === null) return;

		mutate(
			{ isRsvpGoing: toAttendanceResponse(selectedAttendance) },
			{
				onSuccess: () => {
					queryClient.invalidateQueries(getAfterPartyByIdQueryOptions(gatheringId));
					queryClient.invalidateQueries(getAfterPartyInvitedMembersQueryOptions(gatheringId));
					setIsOpen(false);
					onEditSuccess(selectedAttendance);
				},
			},
		);
	};

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange} container={ref.current}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent className="mx-auto" style={{ maxWidth: ref.current?.clientWidth ?? 'auto' }}>
				<DrawerHeader>
					<DrawerTitle className="font-semibold text-label-normal text-title2">
						수정하기
					</DrawerTitle>
				</DrawerHeader>

				<div className="flex flex-col gap-4 px-6 py-4">
					<div className="font-semibold text-body2 text-label-subtle">회식 참여 여부</div>

					<AttendanceSelector
						value={selectedAttendance}
						onChange={setSelectedAttendance}
						name="edit-attendance"
					/>

					<div
						className={cn(
							'relative flex items-center gap-3 rounded-lg bg-background-subtle p-4',
							isClosed && 'bg-red-50',
						)}
					>
						<div className="flex flex-1 flex-col gap-1">
							{isClosed ? (
								<>
									<p className="font-semibold text-body2 text-label-normal">
										조사 마감 후 수정인 만큼,
										<br />
										신중하게 선택해주세요!
									</p>
									<p className="text-caption1 text-label-assistive">
										조사 마감 후 수정은 식당 예약에 영향을 줄 수 있어요.
									</p>
								</>
							) : (
								<>
									<p className="font-semibold text-body2 text-label-normal">
										참석여부를 신중하게 선택해주세요!
									</p>
									<p className="text-caption1 text-label-assistive">
										사전 조사 인원을 기준으로 식당을 예약해요.
										<br />
										변동이 생기면 운영진과 식당에 어려움이 생길 수 있어요.
									</p>
								</>
							)}
						</div>
						<Image
							src={isClosed ? FaceDissapointed : FaceGlasses}
							alt="face"
							width={40}
							height={40}
							className="absolute top-3 right-2"
						/>
					</div>
				</div>

				<DrawerFooter>
					<Button
						variant="secondary"
						size="full"
						className="h-14 rounded-lg"
						onClick={handleSubmit}
						disabled={isPending}
					>
						{isPending ? '수정 중...' : '수정하기'}
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
