'use client';

import type { AttendanceMember, AttendanceStatus } from '@dpm-core/api';
import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	toast,
} from '@dpm-core/shared';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Profile } from '@/components/attendance/profile';
import { modifyAttendanceStatusOptions } from '@/remotes/mutations/attendance';

const ATTENDANCE_STATUS = [
	{ label: '출석', value: 'PRESENT' },
	{ label: '지각', value: 'LATE' },
	{ label: '인정', value: 'EXCUSED_ABSENT' },
	{ label: '결석', value: 'ABSENT' },
];

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
				<Button variant="secondary" size="full" className="fixed max-w-lg w-full bottom-0">
					수정하기
				</Button>
			</DrawerTrigger>
			<DrawerContent className="mx-auto max-w-lg">
				<DrawerHeader className="px-5 mb-8">
					<DrawerTitle>출석 규정 안내</DrawerTitle>
				</DrawerHeader>
				<section className="mx-5 mb-5">
					<Profile size={60} name={member.name} part={member.part} teamNumber={member.teamNumber} />
					<RadioGroup.Root
						value={selectedStatus}
						className="w-full mt-3 flex border border-line-normal rounded-lg"
						onValueChange={(value) => setSelectedStatus(value as AttendanceStatus)}
					>
						{ATTENDANCE_STATUS.map((status) => (
							<RadioGroup.Item
								key={status.value}
								value={status.value}
								className="flex-1 px-3 py-2.5 data-[state=checked]:bg-primary-extralight data-[state=checked]:text-primary-normal"
							>
								<span className="text-body2 font-semibold whitespace-nowrap">{status.label}</span>
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
