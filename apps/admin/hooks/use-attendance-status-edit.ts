import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AttendanceStatus } from '@dpm-core/api';
import { gaTrackAttendanceOverride } from '@dpm-core/shared';

import { toast } from '@/lib/toast';
import { modifyAttendanceStatusOptions } from '@/remotes/mutations/attendance';
import { invalidateMemberManagement } from '@/remotes/queries/member';

interface UseAttendanceStatusEditParams {
	sessionId: number;
	memberId: number;
	initialStatus: AttendanceStatus;
	successMessage?: string;
}

export const useAttendanceStatusEdit = ({
	sessionId,
	memberId,
	initialStatus,
	successMessage = '출석 정보를 저장했습니다.',
}: UseAttendanceStatusEditParams) => {
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>(initialStatus);

	const queryClient = useQueryClient();

	const { mutate: modifyStatus, isPending } = useMutation(
		modifyAttendanceStatusOptions(sessionId, memberId, {
			onSuccess: async () => {
				gaTrackAttendanceOverride(
					sessionId.toString(),
					memberId.toString(),
					initialStatus,
					selectedStatus,
				);

				await queryClient.invalidateQueries({
					queryKey: ['ATTENDANCE'],
				});

				invalidateMemberManagement(queryClient);
				toast.success(successMessage);
				setIsEditMode(false);
			},
			onError: () => toast.error('출석 정보 수정에 실패했습니다.'),
		}),
	);

	const handleEdit = () => {
		setSelectedStatus(initialStatus);
		setIsEditMode(true);
	};

	const handleSave = () => {
		if (!isPending) modifyStatus({ attendanceStatus: selectedStatus });
	};

	const handleCancel = () => {
		setSelectedStatus(initialStatus);
		setIsEditMode(false);
	};

	return {
		isEditMode,
		selectedStatus,
		setSelectedStatus,
		handleEdit,
		handleSave,
		handleCancel,
		isLoading: isPending,
	};
};
