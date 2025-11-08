'use client';

import { useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AttendanceStatus, attendance } from '@dpm-core/api';
import {
	ATTENDANCE_STATUS_OPTIONS,
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	toast,
	XCircle,
} from '@dpm-core/shared';

import { ATTENDANCE_QUERY_KEY } from '@/remotes/queries/attendance';

interface SelectedMember {
	id: number;
	name: string;
}

interface AttendanceBulkModifyModalProps {
	sessionId: number;
	selectedMembers: SelectedMember[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const AttendanceBulkModifyModal = ({
	sessionId,
	selectedMembers,
	open,
	onOpenChange,
}: AttendanceBulkModifyModalProps) => {
	const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus | null>(null);

	const queryClient = useQueryClient();

	// TODO: BULK API 추가 후 수정 필요
	const { mutate: modifyBulkStatus, isPending } = useMutation({
		mutationFn: async (status: AttendanceStatus) => {
			const promises = selectedMembers.map((member) =>
				attendance.modifyAttendanceStatus({
					sessionId,
					memberId: member.id,
					attendanceStatus: status,
				}),
			);
			return Promise.all(promises);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [ATTENDANCE_QUERY_KEY],
			});
			toast.success('출석 정보를 저장했습니다.');
			onOpenChange(false);
		},
		onError: () => {
			toast.error('출석 정보 수정에 실패했습니다.');
		},
	});

	const handleSave = () => {
		if (!selectedStatus) return;
		modifyBulkStatus(selectedStatus);
	};

	const selectedCount = selectedMembers.length;
	const firstMemberName = selectedMembers[0]?.name || '';
	const targetText =
		selectedCount === 1 ? firstMemberName : `${firstMemberName} 외 ${selectedCount - 1}명`;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]" showCloseButton={false}>
				<DialogHeader className="items-start gap-3 text-left">
					<div className="flex w-full items-center justify-between">
						<DialogTitle>출석 정보 수정</DialogTitle>
						<DialogClose asChild>
							<Button variant="none" size="none" className="size-6">
								<XCircle className="size-6 text-icon-normal" />
							</Button>
						</DialogClose>
					</div>
					<DialogDescription>
						선택한 인원의 출석 상태가 지정한 값으로 일괄 변경됩니다.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-6 py-5">
					<div className="flex flex-col gap-2">
						<p className="font-semibold text-body1 text-label-subtle">출석 정보 수정</p>
						<RadioGroup.Root
							value={selectedStatus}
							className="flex w-full rounded-lg border border-line-normal"
							onValueChange={(value) => setSelectedStatus(value as AttendanceStatus)}
						>
							{ATTENDANCE_STATUS_OPTIONS.map((status) => (
								<RadioGroup.Item
									key={status.value}
									value={status.value}
									className="flex-1 px-3 py-2.5 text-label-assistive data-[state=checked]:bg-primary-extralight data-[state=checked]:text-primary-normal"
								>
									<span className="whitespace-nowrap font-normal text-body2">{status.label}</span>
								</RadioGroup.Item>
							))}
						</RadioGroup.Root>
					</div>

					<p className="font-semibold text-body1 text-label-subtle">
						수정 적용 대상 : {targetText}
					</p>
				</div>

				<DialogFooter>
					<Button
						variant="secondary"
						size="lg"
						className="w-full"
						onClick={handleSave}
						disabled={!selectedStatus}
						loading={isPending}
					>
						저장하기
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
