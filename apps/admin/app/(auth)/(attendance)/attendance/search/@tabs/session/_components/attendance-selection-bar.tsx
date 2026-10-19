'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, useIsPresent, useReducedMotion } from 'motion/react';
import { type AttendanceStatus, attendance } from '@dpm-core/api';
import {
	ATTENDANCE_LABEL_MAP,
	ATTENDANCE_STATUS_OPTIONS,
	Button,
	ToggleGroup,
	ToggleGroupItem,
	XIcon,
} from '@dpm-core/shared';

import { toast } from '@/lib/toast';
import { ATTENDANCE_QUERY_KEY } from '@/remotes/queries/attendance';

interface AttendanceSelectionBarProps {
	sessionId: number;
	selectedIds: number[];
	onClear: () => void;
}

export function AttendanceSelectionBar({
	sessionId,
	selectedIds,
	onClear,
}: AttendanceSelectionBarProps) {
	const [status, setStatus] = useState<AttendanceStatus | null>(null);

	const isPresent = useIsPresent();

	const shouldReduceMotion = useReducedMotion();

	const bulkOptions = ATTENDANCE_STATUS_OPTIONS.filter((option) => option.value !== 'PENDING');

	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationKey: [ATTENDANCE_QUERY_KEY, 'bulk', sessionId],
		mutationFn: (attendanceStatus: AttendanceStatus) =>
			attendance.modifyBulkAttendanceStatus({
				sessionId,
				memberIds: selectedIds,
				attendanceStatus,
			}),
		onSuccess: async (_, savedStatus) => {
			await queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEY] });
			const label =
				savedStatus === 'EXCUSED_ABSENT' ? '인정 결석' : ATTENDANCE_LABEL_MAP[savedStatus];
			toast.success(`${selectedIds.length}명을 ${label}으로 변경했어요.`);
			onClear();
		},
		onError: () => toast.error('출석 정보 수정에 실패했습니다.'),
	});

	return (
		<motion.div
			initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
			transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeOut' }}
			className="absolute inset-x-0 bottom-5 z-30 mx-10 flex flex-wrap items-center justify-between gap-2.5 rounded-[20px] bg-background-inverse px-6 py-4 text-label-inverse"
		>
			<div className="flex items-center gap-2">
				<p className="font-bold text-title1">출석 상태 변경</p>
				<p>
					<span className="font-semibold text-body1 text-primary-normal">
						{selectedIds.length}명
					</span>{' '}
					<span className="font-medium text-body1 text-label-assistive">선택됨</span>
				</p>
			</div>
			<div className="flex flex-wrap items-center gap-3">
				<ToggleGroup
					type="single"
					variant="outline"
					size="lg"
					value={status ?? ''}
					onValueChange={(value) => setStatus(value ? (value as AttendanceStatus) : null)}
					disabled={mutation.isPending || !isPresent}
					className="w-100 overflow-hidden rounded-lg shadow-none"
				>
					{bulkOptions.map((option) => (
						<ToggleGroupItem
							key={option.value}
							value={option.value}
							className="w-25 flex-none border-line-normal text-body2 text-label-assistive first:rounded-l-lg last:rounded-r-lg data-[state=on]:bg-primary-extralight data-[state=on]:text-primary-normal"
						>
							{option.label}
						</ToggleGroupItem>
					))}
				</ToggleGroup>
				<Button
					size="md"
					loading={mutation.isPending}
					disabled={status === null || !isPresent}
					onClick={() => {
						if (status) mutation.mutate(status);
					}}
				>
					저장하기
				</Button>
				<Button
					size="none"
					variant="none"
					className="size-6 rounded-full bg-background-strong p-0 text-label-tertiary"
					disabled={mutation.isPending || !isPresent}
					title="선택 해제"
					onClick={onClear}
				>
					<XIcon className="size-3" />
				</Button>
			</div>
		</motion.div>
	);
}
