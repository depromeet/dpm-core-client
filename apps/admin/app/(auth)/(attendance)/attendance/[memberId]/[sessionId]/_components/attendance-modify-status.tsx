'use client';

import { useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AttendanceMember, AttendanceStatus } from '@dpm-core/api';
import {
	ATTENDANCE_STATUS_OPTIONS,
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	toast,
	gaTrackAttendanceOverride,
} from '@dpm-core/shared';

import { Profile } from '@/components/attendance/profile';
import { modifyAttendanceStatusOptions } from '@/remotes/mutations/attendance';

interface AttendanceModifyStatusProps {
	sessionId: number;
	member: AttendanceMember;
	attendanceStatus: AttendanceStatus;
}

export const AttendanceModifyStatus = (props: AttendanceModifyStatusProps) => {
	const { sessionId, member, attendanceStatus } = props;

	const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>(attendanceStatus);

	const queryClient = useQueryClient();
	const { mutate: modifyStatus } = useMutation(
		modifyAttendanceStatusOptions(sessionId, member.id, {
			onSuccess: async () => {
				gaTrackAttendanceOverride(
					sessionId.toString(),
					member.id.toString(),
					attendanceStatus,
					selectedStatus,
				);
				
				queryClient.invalidateQueries({
					queryKey: ['ATTENDANCE'],
				});
				toast.success('출석 정보를 저장했습니다.');
			},
		}),
	);

	const handleModifyStatus = () => {
		modifyStatus({ attendanceStatus: selectedStatus });
	};

	if (!sessionId || !member) {
		return null;
	}

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="secondary" size="full" className="fixed bottom-0 w-full max-w-lg">
					수정하기
				</Button>
			</DrawerTrigger>
			<DrawerContent className="mx-auto max-w-lg">
				<DrawerHeader className="mb-8 px-5">
					<DrawerTitle>출석 규정 안내</DrawerTitle>
				</DrawerHeader>
				<section className="mx-5 mb-5">
					<Profile size={60} name={member.name} part={member.part} teamNumber={member.teamNumber} />
					<RadioGroup.Root
						value={selectedStatus}
						className="mt-3 flex w-full rounded-lg border border-line-normal"
						onValueChange={(value) => setSelectedStatus(value as AttendanceStatus)}
					>
						{ATTENDANCE_STATUS_OPTIONS.map((status) => (
							<RadioGroup.Item
								key={status.value}
								value={status.value}
								className="flex-1 px-3 py-2.5 data-[state=checked]:bg-primary-extralight data-[state=checked]:text-primary-normal"
							>
								<span className="whitespace-nowrap font-semibold text-body2">{status.label}</span>
							</RadioGroup.Item>
						))}
					</RadioGroup.Root>
				</section>

				<DrawerFooter className="p-0">
					<DrawerClose asChild>
						<Button
							variant="secondary"
							size="full"
							disabled={selectedStatus === attendanceStatus}
							onClick={handleModifyStatus}
						>
							저장하기
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
