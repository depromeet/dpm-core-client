import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AttendanceStatus } from '@dpm-core/api';
import { gaTrackAttendanceOverride, toast } from '@dpm-core/shared';

import { modifyAttendanceStatusOptions } from '@/remotes/mutations/attendance';

interface UseAttendanceStatusEditParams {
	sessionId: number;
	memberId: number;
	initialStatus: AttendanceStatus;
}

export const useAttendanceStatusEdit = ({
	sessionId,
	memberId,
	initialStatus,
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

				queryClient.invalidateQueries({
					queryKey: ['ATTENDANCE'],
				});

				toast.success('출석 정보를 저장했습니다.');
				setIsEditMode(false);
			},
		}),
	);

	const handleSave = () => {
		modifyStatus({ attendanceStatus: selectedStatus });
	};

	const handleCancel = () => {
		setSelectedStatus(initialStatus);
		setIsEditMode(false);
	};

	return {
		isEditMode,
		selectedStatus,
		setSelectedStatus,
		setIsEditMode,
		handleSave,
		handleCancel,
		isLoading: isPending,
	};
};
